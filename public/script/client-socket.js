
// Cấu hình socket khi tham gia chat trực tuyến
const socket_on = () => {
    console.log('socket on');

    socket = io({
        query: {
            rooms: client_data.admin.rooms
        }
    });

    socket.on('receive msg', (msg_info) => {
        const receive_msg_event = new CustomEvent('receive-msg', {
            detail: {
                msg_info
            }
        })
        document.dispatchEvent(receive_msg_event);
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

// Xử lý sự kiện socket-join-room khi create một phòng hoặc join một phòng thành công
document.addEventListener('socket-join-room', e => {
    e.preventDefault();
    const roomId = e.detail.roomId
    socket.emit('socket-join-room', { roomId });
})

export {
    socket_on,
    socket_off
}