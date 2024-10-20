// Gửi request leave-room đến server
document.addEventListener('leave-room', (e) => {
    e.preventDefault();

    // // e.detail = {
    // //      roomId (Room._id),
    // //      userId (User._id)
    // // }
    const user_id = e.detail.userId;
    const room_id = e.detail.roomId;

    fetch('/room/leave-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id,
            room_id
        })
    })
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                return;
            }

            console.log('leave Thành công');
            const target_room = document.getElementById(room_id);
            target_room.style.display = 'none';
        })

})