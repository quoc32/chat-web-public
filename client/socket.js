console.log("socket.js loaded.")

const socket_config = (socket, messages) => {
    socket.on("chat message", (message) => {
        const li = document.createElement("li");
        li.textContent = message;
        messages.appendChild(li);
    });
    socket.onAny((eName, ...args) => {
        console.log("Incomming", eName, args);
    })
    socket.onAnyOutgoing((eName, ...args) => {
        console.log("Outgoing:", eName, args);
    })
}

const emit = ({ socket, event, data }) => {
    socket.emit(event, data);
}

export {
    socket_config,
    emit
}