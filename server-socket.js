const Room = require("./model/Room")

const socket_handler = (socket) => {
    // console.log("Một client mới kết nối đến.");

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
        console.log('send msg', msg_info);

        // Thêm msg vào trường msgs trong room
        const msg = {
            sender: msg_info.sender,
            data: msg_info.content
        }
        Room.findByIdAndUpdate(
            toRoom,
            {$push: {msgs: msg}}
        )
        .then(() => {})

        socket.to(toRoom).emit('receive msg', msg_info);
    })

    // Sự kiện 'socket-join-room', khi socket mới join hoặc tạo một room trong phiên đăng nhập
    // Cấu trúc: data {
    //      roomId (Room._id),
    //      userId (User._id)
    // }
    socket.on('socket-join-room', (data) => {
        // console.log('socket-join-room', data);
        const roomId = data.roomId;

        // Tham gia phòng trực tuyến đó
        socket.join(roomId);
        console.log(`Socket joined room by join: ${roomId}`);

        // Kích hoạt sự kiện socket-join-room cho các socket còn lại trong phòng
        socket.to(roomId).emit('socket-join-room', data); // Gửi id (User._id) của member mới

    })


    // disconnect
    socket.on('disconnect', () => {
        console.log('Client đã ngắt kết nối.');
    });
}

module.exports = {
    socket_handler
}