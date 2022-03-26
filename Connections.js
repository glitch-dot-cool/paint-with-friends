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
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
  };

  message = (id, message) => {
    const sender = this.connections[id];
    const payload = { sender, message };
    this._limitMessages();
    this.messages.push(payload);
    this.broadcast(EVENTS.MESSAGE, payload);
  };

  broadcast = (channel, payload) => {
    this.io.emit(channel, payload);
  };

  _limitMessages = () => {
    if (this.messages.length > 9) {
      this.messages.splice(0, 1);
    }
  };
}
