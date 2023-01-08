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
    this.connections[id] = { username: id, isPainting: false };
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
  };

  removeConnection = (id: string) => {
    delete this.connections[id];
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
  };

  renameConnection = (id: string, name: string) => {
    this.connections[id] = {
      username: name,
      isPainting: this.connections[id]?.isPainting || false,
    };
    this._renameSenderInMessageHistory(id, name);
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
    this.io.emit(EVENTS.MESSAGE, this.messages);
  };

  updatePaintStatus = (id: string, isPainting: boolean) => {
    if (this.connections[id]?.isPainting === isPainting) return;

    this.connections[id] = {
      username: this.connections[id]?.username || id,
      isPainting,
    };
    this.broadcast(EVENTS.MEMBERS_CHANGED, this.connections);
  };

  message = (id: string, message: string) => {
    const sender = this.connections[id]?.username;
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
