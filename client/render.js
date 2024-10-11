console.log("render.js loaded.")

const render_messages = (room_id, rooms_cache, messages) => {
    rooms_cache.some((room) => {
        if(room._id === room_id) {
            (room.messages).forEach(message => {
                const li = document.createElement("li");
                li.innerText = message.data;
                messages.appendChild(li);
            });
        }
        return false;
    })

}

export {
    render_messages,
}