const chat_off = () => {
    admin = {};
    rooms_id = [];
    rooms_cache = [];
    messages.innerHTML = "";
    chat_zone.style.display = "none";
    login_zone.style.display = "block";
    login_name.value = "";
    login_password.value = "";
    error_message.innerText = "";

    socket.disconnect();
    socket = {};
}

export {
    chat_off
}