import { socket_on, socket_off } from './client-socket.js';


const t_zone = document.querySelector('.chat-zone');

const t_admin_name = document.querySelector('.chat-zone-admin-name');

const t_rooms = document.querySelector('.rooms');

const t_rooms_list = document.querySelector('.rooms-list');


let rooms_created = [] // Chứa các room đã tạo trong dom
let rooms_displayed = [] // Chứa id room hiện tại đang được hiện trong dom

// Xử lý sự kiện 'go-to-room' cho t_rooms
// t_rooms.addEventListener('go-to-room', (e) => {

//     const current_room = e.detail.room_info;
//     const room_data = (client_data.rooms).find(room => room._id === current_room._id);

//     const h3_room_name = document.createElement('h3');
//     h3_room_name.className = 'room-name';
//     h3_room_name.innerText = `ROOM: ${current_room.name}`;
//     t_rooms.appendChild(h3_room_name);

//     const room = document.createElement('div');
//     room.className = 'room';
//     room.id = current_room._id;
//     room.style.display = 'none';
//     t_rooms.appendChild(room);

//     if (!rooms_list.some(item => item.id === room.id)) {
//         rooms_list.push(room);
//     } else {
//         return;
//     }

//     const msgs_display = document.createElement('div');
//     msgs_display.className = 'msgs-display';
//     room.appendChild(msgs_display);

//     const msgs = document.createElement('ul');
//     msgs.className = 'msgs';
//     msgs_display.appendChild(msgs);

//     (room_data.msgs).forEach(msg_data => {
//         const msg = document.createElement('li');
//         msg.className = 'msg';

//         const sender_name = ((client_data.users).find(user => user._id === msg_data.sender)).name;
//         msg.innerText = `${sender_name}: ${msg_data.data}`;
//         msgs.appendChild(msg);
//     })

//     // form gửi tin nhắn
//     const chat_form = document.createElement('form');

//     const chat_msg = document.createElement('input');
//     chat_form.appendChild(chat_msg);

//     const send_msg_btn = document.createElement('button');
//     send_msg_btn.innerText = 'Send';
//     send_msg_btn.type = 'submit';
//     chat_form.appendChild(send_msg_btn);

//     chat_form.addEventListener('submit', (e) => {
//         // Xử lý việc gửi tin nhắn
//         e.preventDefault();
//         if(chat_msg.value) {
//             const msg_info = {
//                 toRoom: current_room._id,
//                 content: chat_msg.value,
//                 sender: client_data.admin._id
//             }

//             const li = document.createElement('li');
//             li.innerText = `${client_data.admin.name}: ${chat_msg.value}`;
//             li.className = 'msg';
//             msgs.appendChild(li);

//             socket.emit('send msg', msg_info);
//             chat_msg.value = '';
//         }

//     })

//     // Xử lý khi nhận được tin nhắn (xử lý sự kiện receive-msg)
//     document.addEventListener('receive-msg', (e) => {
//         e.preventDefault();
//         const msg_info = e.detail;

//         if(current_room._id == msg_info.toRoom) {
//             const li = document.createElement('li');
//             const sender_name = ((client_data.users).find(user => user._id === msg_info.sender)).name;
//             li.innerText = `${sender_name}: ${msg_info.content}`;
//             li.className = 'msg';
//             msgs.appendChild(li);
//         }
//     })

//     t_rooms.appendChild(chat_form);
// })


// Xử lý sự kiện của t_rooms khi data của một room được load hoàn chỉnh: room-ready
t_rooms.addEventListener('room-ready', (e) => {
    const roomId = e.detail.roomId;
    const room_data = (client_data.rooms).find(room => room._id === roomId); // Lấy room_data dựa theo roomId mà e.detail cung cấp

    const room = document.createElement('div');
    room.className = 'room';
    room.style.display = 'none';
    room.id = roomId;
    t_rooms.appendChild(room); // Thêm vào danh sách rooms_created
    rooms_created.push(room);

    const h3_room_name = document.createElement('h3'); // Tạo thẻ ghi Tên và Id room
    h3_room_name.style.color = 'red';
    h3_room_name.innerText = `ROOM: ${room_data.name} (id: #${room_data._id})`;
    room.appendChild(h3_room_name);

    const msgs_container = document.createElement('div'); // Tạo msgs container
    msgs_container.className = 'msgs-container';
    room.appendChild(msgs_container);

    const msgs = document.createElement('ul'); // msgs - danh sách chứa các mgs
    msgs.className = 'msgs';
    msgs_container.appendChild(msgs);

    // Thêm các msg vào msgs dựa theo room_data
    (room_data.msgs).forEach(msg_data => {
        const msg = document.createElement('li');
        msg.className = 'msg';

        const sender_name = ((client_data.users).find(user => user._id === msg_data.sender)).name;
        msg.innerText = `${sender_name}: ${msg_data.data}`;
        msgs.appendChild(msg);
    })
    // Thêm các msg vào msgs dựa theo sự kiện: receive-msg của dom
    document.addEventListener('receive-msg', (e) => {
        const msg_info = e.detail.msg_info;

        if(msg_info.toRoom != room.id) {
            return;
        }

        console.log(msg_info);
        const msg = document.createElement('li');
        msg.className = 'msg';

        const sender_name = ((client_data.users).find(user => user._id === msg_info.sender)).name;
        msg.innerText = `${sender_name}: ${msg_info.content}`;
        msgs.appendChild(msg);
    })
    
    

    // Thêm các form gửi tin nhắn cho room
    const chat_form = document.createElement('form');
    room.appendChild(chat_form);

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
                toRoom: room_data._id,
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

})

// Xử lý sự kiện của t_rooms khi click vào btn của room đó: go-to-room
t_rooms.addEventListener('go-to-room', (e) => {
    e.preventDefault();
    const room_info = e.detail.room_info;

    const target_room = rooms_created.find(room => room.id === room_info._id);

    if(!rooms_displayed.includes(target_room.id)) {
        // Nếu target_room chưa display, display room lên (style.display = 'block') 
        target_room.style.display = 'block';
        rooms_displayed.push(target_room.id);
    } else {
        // Nếu targer_room đã display, ẩn nó đi (style.display = 'none')
        target_room.style.display = 'none';
        rooms_displayed = rooms_displayed.filter((el) => el != target_room.id);
    }
})


// Xử lý khi nhấn nút Logout
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

// Xử lý các sự kiện khi thoát ra register hoặc login
document.addEventListener('go-to-register', () => {
    t_zone.style.display = 'none';
    client_data.current_page = 'register-page';

    // Ngắt kết nối socket khi thoát ra register (mặc dù không có)
    socket_off();
})
document.addEventListener('go-to-login', () => {
    t_zone.style.display = 'none';
    client_data.current_page = 'login-page';

    rooms_created = []
    rooms_displayed = []

    // Ngắt kết nối socket khi thoát ra login
    socket_off();
})

// Xử lý sự kiện 'go-to-chat': xự kiện khi vừa đăng nhập
document.addEventListener('go-to-chat', async () => {
    t_zone.style.display = 'block';
    client_data.current_page = 'chat-page';

    t_admin_name.innerText = "LOGIN AS: " + client_data.admin.name;

    // Lấy thông tin của admin để load các rooms
    (client_data.admin.rooms).forEach(room => {
        fetch(`/room/get-room/${room}`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                if(data._id) {
                    client_data.rooms.push(data);

                    // Thêm các btn của room để kích hoạt sự kiện go-to-room khi click vào nó
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

                    // ------------
                    return data;
                } else {
                    throw Error('Load room data thất bại.');
                }
            })

            // Load thông tin user trong phòng
            .then(data => {
                const members = data.members;
                const users_fetching = members.map(mem => {
                    
                    const is_loaded = (client_data.users).some(user => {
                        return user._id === mem;
                    });

                    if (!is_loaded) {
                        const user_fetching = fetch(`/user/get-user/${mem}`)
                            .then(res => res.json())
                            .then(data => {
                                if (!client_data.users.some(user => user._id === data._id)) {
                                    client_data.users.push(data);
                                }
                            });
                        
                        return user_fetching;
                    }
                });
                
                Promise.all(users_fetching)
                    .then(() => {
                        const room_ready_event = new CustomEvent('room-ready', {
                            detail : {
                                roomId: data._id
                            }
                        })
                        t_rooms.dispatchEvent(room_ready_event);
                    })

                return data;
            });
    });

    // Xử lý kêt nối socketio khi chat-on
    socket_on();
})