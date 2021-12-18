class Connections {
  constructor() {
    this.connections = {};
  }

  addConnection = (socket) => {
    const { id } = socket;
    this.connections[id] = id;
    socket.broadcast.emit("members", this.connections);
  };

  removeConnection = (socket) => {
    const { id } = socket;
    delete this.connections[id];
    socket.broadcast.emit("members", this.connections);
  };

  renameConnection = (socket, name) => {
    const { id } = socket;
    this.connections[id] = name;
    socket.broadcast.emit("members", this.connections);
  };
}

module.exports = Connections;
