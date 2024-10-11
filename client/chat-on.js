const chat_on = (client_info, client_elms) => {
    const { chat_zone, login_zone } = client_elms;
    const { admin, rooms_cache, user_cache } = client_info;
    rooms = admin.rooms;
    if(admin) {
        chat_zone.style.display = "block";
        login_zone.style.display = "none";

        rooms_cache.forEach(room => {
            const div = document.createElement("div");
            const p_room_name = document.createElement("p")
            p_room_name.innerText = room.name;

        })
        rooms_id.forEach(room => {
            load_room(room)
                .then(data => {
                    rooms_cache.push(data);
                })
        })
        socket = io({
            query: {
                rooms: JSON.stringify(rooms_id)
            }
        });
        socket_config(socket, messages);
    }
}

export {
    chat_on
}