import express from "express";
import { Server } from "socket.io";

import { Connections } from "./Connections.js";
import { initServerP5 } from "./serverP5.js";
import { eventEmitter, EVENTS } from "./event.js";

const port = 3000;

const app = express();
app.use(express.json());

app.use(express.static("public"));
initServerP5();

const server = app.listen(port, () =>
  console.log(`server listening on port ${port}`)
);

const io = new Server(server);
const connectedUsers = new Connections(io);

io.sockets.on("connection", (socket) => {
  socket.emit("connected", socket.id);
  connectedUsers.addConnection(socket.id);

  socket.on("update", (data) => {
    socket.broadcast.emit("update", data);
    eventEmitter.emit(EVENTS.DRAW_UPDATE, data);
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

app.post("/message", async (req, res) => {
  const { id, message } = req.body;
  connectedUsers.message(id, message);
  res.sendStatus(200);
});
