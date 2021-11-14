const express = require("express");
const socket = require("socket.io");

const port = 3000;

const app = express();

app.use(express.static("public"));

const server = app.listen(port, () =>
  console.log(`server listening on port ${port}`)
);

const io = socket(server);

io.sockets.on("connection", (socket) => {
  console.log(`client connected: ${socket.id}`);
});
