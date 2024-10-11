const socket_handler = (socket) => {
    const rooms = JSON.parse(socket.handshake.query.rooms);
    console.log(rooms);

    console.log("A new user had connected");
    rooms.forEach((room) => {
        socket.join(room);
    })

    socket.on("disconnect", () => {
        console.log("A user had disconnected.");
    });

    socket.on("chat message", ({ message, room }) => {
        socket.broadcast.to(room).emit("chat message", { message, room });
    });
    
    socket.onAny((eName, ...args) => {
        console.log("Incomming", eName, args);
    });
    socket.onAnyOutgoing((eName, ...args) => {
        console.log("Outgoing:", eName, args);
    });
}

module.exports = {
    socket_handler
}