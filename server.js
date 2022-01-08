const express = require("express");
const socket = require("socket.io");
const Connections = require("./Connections.js");

const port = 3000;

const app = express();
app.use(express.json());

app.use(express.static("public"));

const server = app.listen(port, () =>
  console.log(`server listening on port ${port}`)
);

const io = socket(server);
const connectedUsers = new Connections(io);

io.sockets.on("connection", (socket) => {
  socket.emit("connected", socket.id);
  connectedUsers.addConnection(socket.id);

  socket.on("update", (data) => {
    socket.broadcast.emit("update", data);
  });

  socket.on("disconnect", (reason) => {
    connectedUsers.removeConnection(socket.id);
  });
});

app.post("/update-username", async (req, res) => {
  const { id, username } = req.body;
  connectedUsers.renameConnection(id, username);
  res.sendStatus(200);
});
