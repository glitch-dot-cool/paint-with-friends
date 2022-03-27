import { EVENTS } from "./public/src/constants.js";

export class Connections {
  constructor(io) {
    this.io = io;
    this.connections = {};
    this.messages = [];
  }

  addConnection = (id) => {
    this.connections[id] = id;
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
  };

  removeConnection = (id) => {
    delete this.connections[id];
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
  };

  renameConnection = (id, name) => {
    this.connections[id] = name;
    this._renameSenderInMessageHistory(id, name);
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
    this.io.emit(EVENTS.MESSAGE, this.messages);
  };

  message = (id, message) => {
    const sender = this.connections[id];
    this._limitMessages();
    this.messages.push({ sender, message, id });
    this.broadcast(EVENTS.MESSAGE, this.messages);
  };

  broadcast = (channel, payload) => {
    this.io.emit(channel, payload);
  };

  _limitMessages = () => {
    if (this.messages.length > 9) {
      this.messages.splice(0, 1);
    }
  };

  _renameSenderInMessageHistory = (id, newName) => {
    this.messages = this.messages.map((msg) => {
      if (msg.id === id) {
        msg.sender = newName;
      }
      return msg;
    });
  };

  purgeMessages = () => {
    setInterval(() => (this.messages = []), 1000 * 60 * 5);
  };
}
