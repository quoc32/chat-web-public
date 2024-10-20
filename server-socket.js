const Room = require("./model/Room")

const socket_handler = (socket) => {
    console.log("Một client mới kết nối đến.");

    // Tham gia các room trực tuyến
    const rooms = socket.handshake.query.rooms;
    if (rooms) {
        rooms.split(',').forEach((room) => {
            socket.join(room);
            console.log(`Socket joined room: ${room}`);
        });
    }

    // Sự kiện 'send msg', khi socket gửi tin
    // Cấu trúc: msg_info {
    //      toRoom (Room._id),
    //      content (string),
    //      sender (User._id)
    // }
    socket.on('send msg', (msg_info) => {
        const toRoom = msg_info.toRoom;
        console.log(msg_info);

        // Thêm msg vào trường msgs trong room
        const msg = {
            sender: msg_info.sender,
            data: msg_info.content
        }
        Room.findByIdAndUpdate(
            toRoom,
            {$push: {msgs: msg}},
            {new: true}
        ).then((newRoom) => {console.log(newRoom)})

        socket.to(toRoom).emit('receive msg', msg_info);
    })

    // Sự kiện 'socket-join-room', khi socket mới join hoặc tạo một room trong phiên đăng nhập
    // Cấu trúc: data {
    //      roomId (Room._id)
    // }
    socket.on('socket-join-room', (data) => {
        const roomId = data.roomId;
        socket.join(roomId);
    })

    socket.on('disconnect', () => {
        console.log('Client đã ngắt kết nối.');
    });
}

module.exports = {
    socket_handler
}