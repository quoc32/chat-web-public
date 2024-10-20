
// Cấu hình socket khi tham gia chat trực tuyến
const socket_on = () => {
    console.log('socket on');

    socket = io({
        query: {
            rooms: client_data.admin.rooms
        }
    });

    // Sự kiện nhận Tin Nhắn
    socket.on('receive msg', (msg_info) => {
        console.log("receive msg");
        const receive_msg_event = new CustomEvent('receive-msg', {
            detail: {
                msg_info
            }
        })
        document.dispatchEvent(receive_msg_event);
    })

    // Sự kiện socket-join-room: khi có người dùng khác tham gia phòng chat
    socket.on('socket-join-room', data => {
        // Cấu trúc: data {
        //      roomId (Room._id),
        //      userId (User._id)
        // }
        const new_member = data.userId;
        console.log('new member join', new_member);
        // Cập nhật thông tin user mới
        fetch(`/user/get-user/${new_member}`)
        .then(res => res.json())
        .then(data => {
            if (!client_data.users.some(user => user._id === data._id)) {
                client_data.users.push(data);
            }
        });
    })
}

// Cấu hình socket khi rời tham gia chat trực tuyến
const socket_off = () => {
    console.log('socket off');

    try {
        socket.disconnect();
    } catch {
        
    }
    socket = {};

}

// // Xử lý sự kiện socket-join-room khi create một phòng hoặc join một phòng thành công
// document.addEventListener('socket-join-room', e => {
//     e.preventDefault();
//     const roomId = e.detail.roomId;
//     co
// })

export {
    socket_on,
    socket_off
}