
const t_form = document.querySelector('.create-room-form');
const t_name_input = document.querySelector('.create-room-name-input');
const t_password_input = document.querySelector('.create-room-password-input');

const t_message = document.querySelector('.create-room-message');

t_form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = t_name_input.value;
    const password = t_password_input.value;
    const creater = client_data.admin._id;

    if(!name || !password) {
        t_message.style.color = 'red';
        t_message.style.background = 'black';
        t_message.innerText = "Hãy điền đầy đủ các trường Name và Password";
        return;
    }

    fetch('/room/create-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            creater,
            password
        })
    })
        .then(res => res.json())
        .then(data => {
            if(data.message) {
                t_message.style.color = 'red';
                t_message.style.background = 'black';
                t_message.innerText = data.message;
            } else {
                t_message.style.color = 'green';
                t_message.style.background = 'yellow';
                t_message.innerText = "Tạo phòng thành công";

            }
            // Join room mới tạo
            fetch('/room/join-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: creater,
                    room_id: data._id
                })
            })
                .then(res => res.json())
                .then(data => {
                    // data là Room
                    if(data.error) {
                        t_message.style.color = 'red';
                        t_message.style.background = 'black';
                        t_message.innerText = data.message;
                        return;
                    } else {
                        t_message.style.color = 'green';
                        t_message.style.background = 'yellow';
                        t_message.innerText = "Tham gia phòng thành công";
        
                    }
                    // Kích hoạt sự kiện join-room-success của dom khi tham gia phòng thành công
                    // Sự kiện sẽ render room lên rooms
                    // và User trong room đó
                    const join_room_success_event = new CustomEvent('join-room-success', {
                        detail: {
                            new_room_data: data
                        }
                    })
                    document.dispatchEvent(join_room_success_event);
                    
                    // Kích hoạt sự kiện socket-join-room của socket khi tham gia phòng thành công
                    // Sự kiện dùng để thông báo cho các user trong phòng biết có user mới tham gia room đó
                    const socket_join_room_data = {
                        roomId: data._id,
                        userId: creater
                    }
                    // console.log('Tham gia phòng thành công, gửi socket-join-room', socket_join_room_data);
                    socket.emit('socket-join-room', socket_join_room_data);
                })

        })

    // Reset giá trị trong các thẻ input
    t_name_input.value = '';
    t_password_input.value = '';
})
