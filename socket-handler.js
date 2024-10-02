const socket_handler = (socket) => {
    console.log("A new user had connected");
    socket.join("room-A")

    socket.on("disconnect", () => {
        console.log("A user had disconnected.");
    });

    socket.on('chat message', async (message) => {
        socket.to("room-A").emit("chat message", message);
    });

    socket.onAny((eName, ...args) => {
        console.log("Incomming", eName, args);
    })
    socket.onAnyOutgoing((eName, ...args) => {
        console.log("Outgoing:", eName, args);
    })
}

module.exports = {
    socket_handler
}