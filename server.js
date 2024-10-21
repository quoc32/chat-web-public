require("dotenv").config();
const path = require('node:path');
const http = require('node:http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Socket
const socketIo = require('socket.io');
const io = new socketIo.Server(server);

const { socket_handler } = require('./server-socket');
io.on('connection', socket_handler);

const { user_router } = require("./routes/user")
app.use('/user', user_router)

const { room_router } = require("./routes/room")
app.use('/room', room_router)


server.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
