require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { join } = require("node:path");

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.SERVER_PORT || 3000
const SERVER_URL = process.env.SERVER_URL || "http://localhost"

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

const { socket_handler } = require("./socket-handler");
io.on("connection", socket_handler);

server.listen(PORT, () => {
    console.log(`server running at ${SERVER_URL}:${PORT}`);
});