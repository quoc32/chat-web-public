require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { join } = require("node:path");

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.SERVER_PORT || 3000

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});


const { getUser, getRoom } = require("./database-handler");
app.get("/room-in/:name", (req, res) => {
    const name = req.params.name;
    getUser(name)
        .then((user) => {
            res.send(user["room-in"]);
        })
});
app.get("/room-messages/:room_id", (req, res) => {
    const room_id = req.params.room_id;
    getRoom(room_id)
        .then((room) => {
            res.send(room.messages);
        })
});



const { socket_handler } = require("./socket-handler");
io.on("connection", socket_handler);


server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});