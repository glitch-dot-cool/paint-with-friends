const express = require("express");
const socket = require("socket.io");
const Connections = require("./ConnectedClients.js");

const port = 3000;

const app = express();

app.use(express.static("public"));

const server = app.listen(port, () =>
  console.log(`server listening on port ${port}`)
);

const io = socket(server);
const connectedUsers = new Connections();

io.sockets.on("connection", (socket) => {
  connectedUsers.addConnection(socket);

  socket.on("update", (data) => {
    socket.broadcast.emit("update", data);
  });

  socket.on("disconnect", (reason) => {
    connectedUsers.removeConnection(socket);
  });
});
