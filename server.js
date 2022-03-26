import express from "express";
import { Server } from "socket.io";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { Connections } from "./Connections.js";
import { initServerP5 } from "./serverP5.js";
import { eventEmitter } from "./event.js";
import { EVENTS } from "./public/src/constants.js";

const PORT = 3000;

const app = express();
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

const serializeCanvas = initServerP5();

const server = app.listen(PORT, () =>
  console.log(`server listening on port ${PORT}`)
);

const io = new Server(server);
const connectedUsers = new Connections(io);

io.sockets.on(EVENTS.NEW_CONNECTION, (socket) => {
  socket.emit(EVENTS.CONNECTED, socket.id);
  connectedUsers.addConnection(socket.id);

  socket.on(EVENTS.DRAW_UPDATE, (paintProperties) => {
    socket.broadcast.emit(EVENTS.DRAW_UPDATE, paintProperties);
    eventEmitter.emit(EVENTS.DRAW_UPDATE, paintProperties);
  });

  socket.on(EVENTS.MOUSE_RELEASED, () => {
    socket.broadcast.emit(EVENTS.MOUSE_RELEASED);
  });

  socket.on(EVENTS.DISCONNECT, () => {
    socket.removeAllListeners();
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

app.get("/messages", async (req, res) => {
  const messageHistory = connectedUsers.messages;
  res.json(messageHistory).status(200);
});
