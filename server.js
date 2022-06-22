import express from "express";
import { Server } from "socket.io";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { Connections } from "./Connections.js";
import { initServerP5 } from "./serverP5.js";
import { eventEmitter } from "./event.js";
import { EVENTS } from "./public/src/constants.js";
import {
  getCanvasBuffer,
  sendImage,
  sendError,
  invalidateCache,
  setCache,
  generateThumbnail,
} from "./serverUtils.js";

const PORT = 3000;

const app = express();
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

const serializeCanvas = initServerP5();

const cache = {
  thumbnail: { data: null, shouldFetch: true },
  image: { data: null, shouldFetch: true },
};

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
    invalidateCache(cache);
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

app.get("/canvas", async (_, res) => {
  try {
    const serializedCanvasData = serializeCanvas();
    res.json(serializedCanvasData).status(200);
  } catch (error) {
    sendError(res, error, "an error occured while fetching the canvas");
  }
});

app.get("/image/:anyTimestamp", async (_, res) => {
  try {
    if (cache.image.shouldFetch) {
      const buffer = getCanvasBuffer(serializeCanvas);
      setCache(cache, "image", buffer);
    }
    sendImage(res, cache.image.data);
  } catch (error) {
    sendError(res, error, "an error occured while fetching the canvas image");
  }
});

app.get("/thumbnail/:anyTimestamp", async (_, res) => {
  try {
    if (cache.thumbnail.shouldFetch) {
      const buffer = getCanvasBuffer(serializeCanvas);
      const image = await generateThumbnail(buffer);

      setCache(cache, "thumbnail", image);
    }
    sendImage(res, cache.thumbnail.data);
  } catch (error) {
    sendError(res, error, "an error occured while fetching the thumbnail");
  }
});

app.get("/messages", async (_, res) => {
  try {
    const messageHistory = connectedUsers.messages;
    res.json(messageHistory).status(200);
  } catch (error) {
    console.dir(error);
    sendError(res, error, "an error occured while fetching messages");
  }
});
