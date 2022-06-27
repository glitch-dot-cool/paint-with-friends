import { Server } from "socket.io";
import { EVENTS } from "./public/src/constants.js";
import { Connections as ConnectionsType, Messages, Payload } from "./types";

export class Connections {
  io: Server;
  connections: ConnectionsType;
  messages: Messages;

  constructor(io: Server) {
    this.io = io;
    this.connections = {};
    this.messages = [];
  }

  addConnection = (id: string) => {
    this.connections[id] = id;
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
  };

  removeConnection = (id: string) => {
    delete this.connections[id];
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
  };

  renameConnection = (id: string, name: string) => {
    this.connections[id] = name;
    this._renameSenderInMessageHistory(id, name);
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
    this.io.emit(EVENTS.MESSAGE, this.messages);
  };

  message = (id: string, message: string) => {
    const sender = this.connections[id];
    this._limitMessages();
    if (sender) this.messages.push({ sender, message, id });
    this.broadcast(EVENTS.MESSAGE, this.messages);
  };

  broadcast = (channel: string, payload: Payload) => {
    this.io.emit(channel, payload);
  };

  _limitMessages = () => {
    if (this.messages.length > 9) {
      this.messages.splice(0, 1);
    }
  };

  _renameSenderInMessageHistory = (id: string, newName: string) => {
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
