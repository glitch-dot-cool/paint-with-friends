class Connections {
  constructor(io) {
    this.io = io;
    this.connections = {};
  }

  addConnection = (id) => {
    this.connections[id] = id;
    this.broadcast();
  };

  removeConnection = (id) => {
    delete this.connections[id];
    this.broadcast();
  };

  renameConnection = (id, name) => {
    this.connections[id] = name;
    this.broadcast();
  };

  broadcast = () => {
    this.io.emit("members", this.connections);
  };

  get = (id) => {
    return this.connections[id];
  };
}

module.exports = Connections;
