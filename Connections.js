class Connections {
  constructor(io) {
    this.io = io;
    this.connections = {};
  }

  addConnection = (id) => {
    this.connections[id] = id;
    this.broadcast("members", this.connections);
  };

  removeConnection = (id) => {
    delete this.connections[id];
    this.broadcast("members", this.connections);
  };

  renameConnection = (id, name) => {
    this.connections[id] = name;
    this.broadcast("members", this.connections);
  };

  message = (id, message) => {
    const sender = this.connections[id];
    const payload = { sender, message };
    this.broadcast("message", payload);
  };

  broadcast = (channel, payload) => {
    this.io.emit(channel, payload);
  };

  get = (id) => {
    return this.connections[id];
  };
}

module.exports = Connections;
