const express = require("express");
const socket = require("socket.io");

const port = 3000;

const app = express();

app.use(express.static("public"));

app.listen(port, () => console.log(`server listening on port ${port}`));
