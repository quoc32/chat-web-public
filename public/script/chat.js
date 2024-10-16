import { socket_on, socket_off } from './socket.js';


const t_zone = document.querySelector('.chat-zone');

const t_admin_name = document.querySelector('.chat-zone-admin-name');

const t_rooms = document.querySelector('.rooms');

const t_rooms_list = document.querySelector('.rooms-list');

let rooms_list = []

// Xử lý sự kiện 'go-to-room' cho t_rooms
t_rooms.addEventListener('go-to-room', (e) => {

    const current_room = e.detail.room_info;
    const room_data = (client_data.rooms).find(room => room._id === current_room._id);

    const h3_room_name = document.createElement('h3');
    h3_room_name.className = 'room-name';
    h3_room_name.innerText = `ROOM: ${current_room.name}`;
    t_rooms.appendChild(h3_room_name);

    const room = document.createElement('div');
    room.className = 'room';
    room.id = current_room._id;
    room.style.display = 'none';
    t_rooms.appendChild(room);

    if (!rooms_list.some(item => item.id === room.id)) {
        rooms_list.push(room);
    } else {
        return;
    }

    const msgs_display = document.createElement('div');
    msgs_display.className = 'msgs-display';
    room.appendChild(msgs_display);

    const msgs = document.createElement('ul');
    msgs.className = 'msgs';
    msgs_display.appendChild(msgs);

    (room_data.msgs).forEach(msg_data => {
        const msg = document.createElement('li');
        msg.className = 'msg';

        const sender_name = ((client_data.users).find(user => user._id === msg_data.sender)).name;
        msg.innerText = `${sender_name}: ${msg_data.data}`;
        msgs.appendChild(msg);
    })

    // form gửi tin nhắn
    const chat_form = document.createElement('form');

    const chat_msg = document.createElement('input');
    chat_form.appendChild(chat_msg);

    const send_msg_btn = document.createElement('button');
    send_msg_btn.innerText = 'Send';
    send_msg_btn.type = 'submit';
    chat_form.appendChild(send_msg_btn);

    chat_form.addEventListener('submit', (e) => {
        // Xử lý việc gửi tin nhắn
        e.preventDefault();
        if(chat_msg.value) {
            const msg_info = {
                toRoom: current_room._id,
                content: chat_msg.value,
                sender: client_data.admin._id
            }

            const li = document.createElement('li');
            li.innerText = `${client_data.admin.name}: ${chat_msg.value}`;
            li.className = 'msg';
            msgs.appendChild(li);

            socket.emit('send msg', msg_info);
            chat_msg.value = '';
        }

    })

    // Xử lý khi nhận được tin nhắn (xử lý sự kiện receive-msg)
    document.addEventListener('receive-msg', (e) => {
        e.preventDefault();
        const msg_info = e.detail;

        if(current_room._id == msg_info.toRoom) {
            const li = document.createElement('li');
            const sender_name = ((client_data.users).find(user => user._id === msg_info.sender)).name;
            li.innerText = `${sender_name}: ${msg_info.content}`;
            li.className = 'msg';
            msgs.appendChild(li);
        }
    })


    t_rooms.appendChild(chat_form);

})


const logout_btn = document.querySelector('.logout-btn');
logout_btn.addEventListener('click', (e) => {
    e.preventDefault();
    document.dispatchEvent(go_to_login);
    client_data = {
        admin: null,
        users: [],
        rooms: [],
        current_page: "login-page",
        current_room: null,
    }
    t_rooms.innerHTML = '';
    t_rooms_list.innerHTML = '';
})
// ----------------------
document.addEventListener('go-to-register', () => {
    t_zone.style.display = 'none';
    client_data.current_page = 'register-page';
})
document.addEventListener('go-to-login', () => {
    t_zone.style.display = 'none';
    client_data.current_page = 'login-page';

    // Ngắt kết nối socket khi thoát ra login
    socket_off();
})


document.addEventListener('chat-on', async () => {
    t_zone.style.display = 'block';
    client_data.current_page = 'chat-page';

    t_admin_name.innerText = "LOGIN AS: " + client_data.admin.name;

    (client_data.admin.rooms).forEach(room => {
        fetch(`/room/get-room/${room}`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                if(data._id) {
                    client_data.rooms.push(data);

                    // Thêm các btn của room để chuyển đến room và room_list
                    const room_btn = document.createElement('button');
                    room_btn.innerText = data.name;
                    room_btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const go_to_room_event = new CustomEvent('go-to-room', {
                            detail: {
                                room_info: {
                                    _id: data._id,
                                    name: data.name
                                }
                            }
                        })
                        t_rooms.dispatchEvent(go_to_room_event);
                    })
                    t_rooms_list.appendChild(room_btn);

                    // ------

                    return data;
                } else {
                    throw Error('Load room data thất bại.');
                }

            })
            // Load thông tin user trong phòng
            .then(data => {
                const members = data.members;
                
                members.forEach(member => {
                    
                    const is_loaded = (client_data.users).some(user => {
                        // console.log("user._id =", user._id, "member =", member);
                        return user._id === member;
                    });

                    if (!is_loaded) {
                        fetch(`/user/get-user/${member}`)
                            .then(res => res.json())
                            .then(data => {
                                if (!client_data.users.some(user => user._id === data._id)) {
                                    client_data.users.push(data);
                                }
                            });
                    }
                });
                return data;
            });
    });

    // Xử lý kêt nối socketio khi chat-on
    socket_on();
})