import { socket_on, socket_off } from './client-socket.js';


const t_zone = document.querySelector('.chat-zone');
const t_admin_name = document.querySelector('.chat-zone-admin-name');
const t_rooms = document.querySelector('.rooms');
const t_rooms_list = document.querySelector('.rooms-list');

let rooms_created = [] // Chứa các dom obj các room đã tạo trong dom
let rooms_displayed = [] // Chứa id room hiện tại đang được hiện trong dom


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

    // Tạo thẻ ghi Tên và Id room
    const h3_room_name = document.createElement('h3'); 
    h3_room_name.style.color = 'red';
    h3_room_name.innerText = `ROOM: ${room_data.name}`;
    room.appendChild(h3_room_name);

    // Tạo thẻ detail chứa các thông tin của phòng và các tiện ích khác (leave-room, copy id)
    const room_detail_info = document.createElement('details');
    room_detail_info.className = 'room-detail-info';
    h3_room_name.appendChild(room_detail_info);

    const room_detail_info_summary = document.createElement('summary'); // Summary của details
    room_detail_info_summary.innerText = 'Detail...';
    room_detail_info.appendChild(room_detail_info_summary);

    const room_id_span = document.createElement('span'); // Thẻ chứa thông tin id của room
    room_id_span.innerText = `ID của phòng: #${room_data._id}`;
    room_detail_info.appendChild(room_id_span);

    // Tạo thẻ detail_content chứa nội dung của details
    const detail_content = document.createElement('div');
    detail_content.className = 'detail-content';
    room_detail_info.appendChild(detail_content);

    // Thêm copy btn kế bên thông tin id của room
    const copy_room_id_btn = document.createElement('button');
    copy_room_id_btn.innerText = 'copy';
    detail_content.appendChild(copy_room_id_btn);
    copy_room_id_btn.addEventListener('click', (e) => {  // Copy id vào clipboad khi click
        e.preventDefault();

        navigator.clipboard.writeText(roomId).then(() => {
            alert('Đã copy ID vào Clipboard.')
        }).catch(error => {
            alert('Lỗi khi copy.')
        });
    })
    // Thêm nút leave-room
    const leave_room_btn = document.createElement('button'); 
    leave_room_btn.innerText = 'Leave Room';
    detail_content.appendChild(leave_room_btn)
    leave_room_btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('leave');
        const leave_room_event = new CustomEvent('leave-room', {
            detail: {
                         roomId: roomId,
                         userId: client_data.admin._id
            }
        })
        document.dispatchEvent(leave_room_event);
    })


    // Phần nội dung các tin nhắn của room
    // Tạo msgs container
    const msgs_container = document.createElement('div'); 
    msgs_container.className = 'msgs-container';
    room.appendChild(msgs_container);

    // msgs - danh sách chứa các mgs
    const msgs = document.createElement('ul'); 
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

        const msg = document.createElement('li');
        msg.className = 'msg';

        const sender_name = ((client_data.users).find(user => user._id === msg_info.sender)).name;
        msg.innerText = `${sender_name}: ${msg_info.content}`;
        msgs.appendChild(msg);
    })

    // Thêm form gửi tin nhắn cho room
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
        console.log('Send messgae');
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

// Xử lý sự kiện khi mới tạo thành công room mới: create-room-success của document
// Khi sự kiện kích hoạt sẽ thêm nút vào t_rooms_list và create room tương ứng
document.addEventListener('create-room-success', (e) => {
    e.preventDefault();

    const data = e.detail.new_room_data;
    (client_data.rooms).push(data);
    (client_data.admin.rooms).push(data._id);

    // Thêm các btn của room để kích hoạt sự kiện go-to-room khi click vào nó
    const room_btn = document.createElement('button');
    room_btn.innerText = data.name;
    room_btn.className = data._id + '-room-btn';
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

    // Kích hoạt sự kiện room-ready với thông tin room mới tạo
    const room_ready_event = new CustomEvent('room-ready', {
        detail : {
            roomId: data._id
        }
    })
    t_rooms.dispatchEvent(room_ready_event);
})
// Xử lý sự kiện khi mới join thành công room mới: join-room-success của document
// Khi sự kiện kích hoạt sẽ thêm nút vào t_rooms_list và create room tương ứng
document.addEventListener('join-room-success', (e) => {
    e.preventDefault();

    const data = e.detail.new_room_data;
    (client_data.rooms).push(data);
    (client_data.admin.rooms).push(data._id);

    // Load các User trong room và bổ sung vào client_data.users
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
    
    
    // Kích hoạt sự kiện room-ready với thông tin room mới tham gia khi đã load xong thông tin các người dùng trong room
    Promise.all(users_fetching)
        .then(() => {
            const room_ready_event = new CustomEvent('room-ready', {
                detail : {
                    roomId: data._id
                }
            })
            t_rooms.dispatchEvent(room_ready_event);
        })


    // Thêm các btn của room để kích hoạt sự kiện go-to-room khi click vào nó
    const room_btn = document.createElement('button');
    room_btn.innerText = data.name;
    room_btn.className = data._id + '-room-btn';
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
                    room_btn.className = data._id + '-room-btn';
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