require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { join } = require("node:path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.SERVER_PORT || 3000

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "./client/index.html"));
});
app.get("/socket.js", (req, res) => {
    res.sendFile(join(__dirname, "./client/socket.js"));
});
app.get("/load.js", (req, res) => {
    res.sendFile(join(__dirname, "./client/load.js"));
});
app.get("/render.js", (req, res) => {
    res.sendFile(join(__dirname, "./client/render.js"));
});
app.get("/chat-on.js", (req, res) => {
    res.sendFile(join(__dirname, "./client/chat-on.js"));
});
app.get("/chat-off.js", (req, res) => {
    res.sendFile(join(__dirname, "./client/chat-off.js"));
});


const { load_user_controller, load_rooms_controller, load_admin_controller, add_user_controller } = require("./controler");
app.post("/load-admin", load_admin_controller);
app.get("/load-room/:room_id", load_rooms_controller);
app.get("/load-user/:user_id", load_user_controller);
app.post("/add-user", add_user_controller);


const { socket_handler } = require("./socket-handler");
io.on("connection", socket_handler);


const { MGclient } = require("./database");
process.on("SIGINT", async () => {
    console.log("Close MongoDB connection...");
    await MGclient.close();
    process.exit(0);
});


server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});