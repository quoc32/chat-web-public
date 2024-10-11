console.log("load.js loaded.")

const load_admin = async (admin_info) => {
    const responce = await fetch('http://localhost:3000/load-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(admin_info),
    });
    const data = await responce.json();
    return data;
}

const load_room = async (room_id) => {
    const responce = await fetch(`http://localhost:3000/load-room/${room_id}`);
    const data = await responce.json();
    return data;
}

const load_user = async (user_id) => {
    const responce = await fetch(`http://localhost:3000/load-user/${user_id}`);
    const data = await responce.json();
    return data;
}

const load_client_info = (client_info) => {
    rooms = client_info.admin.rooms;
    rooms.forEach(room => {
        load_room(room)
            .then((data) => {
                client_info.rooms_cache.push(data);
                msgs = data["messages"];
                msgs.forEach(msg => {
                    if(!(client_info.loaded_user).includes(msg["sender-id"])) {
                        client_info.loaded_user.push(msg["sender-id"]);
                        load_user(msg["sender-id"])
                            .then(data => {
                                client_info.user_cache.push(data);
                            })
                    }
                })
            })
    });
}

export {
    load_admin, 
    load_room, 
    load_user,
    load_client_info
}