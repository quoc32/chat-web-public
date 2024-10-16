const socket_handler = (socket) => {
    console.log("Một client mới kết nối đến.");

    const rooms = socket.handshake.query.rooms;
    if (rooms) {
        rooms.split(',').forEach((room) => {
            socket.join(room);
            console.log(`Socket joined room: ${room}`);
        });
    }

    socket.on('send msg', (msg_info) => {
        const toRoom = msg_info.toRoom;
        socket.to(toRoom).emit('receive msg', msg_info);
    })

    socket.on('disconnect', () => {
        console.log('Client đã ngắt kết nối.');
    });
}

module.exports = {
    socket_handler
}