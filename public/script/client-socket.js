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


const socket_off = () => {
    console.log('socket off');

    try {
        socket.disconnect();
    } catch {
        
    }
    socket = {};

}

export {
    socket_on,
    socket_off
}