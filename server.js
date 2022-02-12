import express from "express";
import { Server } from "socket.io";

import { Connections } from "./Connections.js";
import { initServerP5 } from "./serverP5.js";
import { eventEmitter } from "./event.js";
import { EVENTS } from "./public/src/constants.js";

const port = 3000;

const app = express();
app.use(express.json());

app.use(express.static("public"));
const serializeCanvas = initServerP5();

const server = app.listen(port, () =>
  console.log(`server listening on port ${port}`)
);

const io = new Server(server);
const connectedUsers = new Connections(io);

io.sockets.on(EVENTS.NEW_CONNECTION, (socket) => {
  socket.emit(EVENTS.CONNECTED, socket.id);
  connectedUsers.addConnection(socket.id);

  socket.on(EVENTS.DRAW_UPDATE, (data) => {
    socket.broadcast.emit(EVENTS.DRAW_UPDATE, data);
    eventEmitter.emit(EVENTS.DRAW_UPDATE, data);
  });

  socket.on(EVENTS.DISCONNECT, (reason) => {
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

app.get("/canvas", async (req, res) => {
  const serializedCanvasData = serializeCanvas();
  res.json(serializedCanvasData).status(200);
});
