import express from "express";
import { Server } from "socket.io";
import sharp from "sharp";
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
connectedUsers.purgeMessages();

io.sockets.on(EVENTS.NEW_CONNECTION, (socket) => {
  socket.emit(EVENTS.CONNECTED, socket.id);
  connectedUsers.addConnection(socket.id);

  socket.on(EVENTS.DRAW_UPDATE, (paintProperties) => {
    socket.broadcast.emit(EVENTS.DRAW_UPDATE, paintProperties);
    eventEmitter.emit(EVENTS.DRAW_UPDATE, paintProperties);
  });

  socket.on(EVENTS.MOUSE_RELEASED, (username) => {
    socket.broadcast.emit(EVENTS.MOUSE_RELEASED, username);
  });

  socket.on(EVENTS.DISCONNECT, () => {
    socket.removeAllListeners();
    connectedUsers.removeConnection(socket.id);
  });
});

app.post("/update-username", async (req, res) => {
  try {
    const { id, username } = req.body;
    connectedUsers.renameConnection(id, username);
    res.sendStatus(200);
  } catch (error) {
    sendError(res, error, "an error occured while updating username");
  }
});

app.post("/message", async (req, res) => {
  try {
    const { id, message } = req.body;
    connectedUsers.message(id, message);
    res.sendStatus(200);
  } catch (error) {
    sendError(res, error, "an error occured while sending a message");
  }
});

app.get("/canvas", async (req, res) => {
  try {
    const serializedCanvasData = serializeCanvas();
    res.json(serializedCanvasData).status(200);
  } catch (error) {
    sendError(res, error, "an error occured while fetching the canvas");
  }
});

app.get("/image/:anyTimestamp", async (req, res) => {
  try {
    const buffer = getCanvasBuffer();
    sendImage(res, buffer);
  } catch (error) {
    sendError(res, error, "an error occured while fetching the canvas image");
  }
});

app.get("/thumbnail/:anyTimestamp", async (req, res) => {
  try {
    const buffer = getCanvasBuffer();
    const image = await sharp(buffer)
      .resize(1280, 720)
      .jpeg({ mozjpeg: true })
      .toBuffer();

    sendImage(res, image);
  } catch (error) {
    sendError(res, error, "an error occured while fetching the  thumbnail");
  }
});

app.get("/messages", async (req, res) => {
  try {
    const messageHistory = connectedUsers.messages;
    res.json(messageHistory).status(200);
  } catch (error) {
    console.dir(error);
    sendError(res, error, "an error occured while fetching messages");
  }
});

const getCanvasBuffer = () => {
  const canvasData = serializeCanvas();
  return Buffer.from(
    canvasData.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
};

const sendImage = (res, image) => {
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": image.length,
  });
  res.end(image);
};

const sendError = (res, error, message) => {
  res.json({ message, error: error.message }).status(500);
};
