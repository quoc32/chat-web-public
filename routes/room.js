const express = require("express");
const room_router = express.Router();

const { get_room_controller,
    create_room_controller, 
    join_room_controller,
    leave_room_controller,
    delete_room_controller } = require("../controller/room-controller");
    
room_router.get("/get-room/:roomId", get_room_controller);
room_router.post("/create-room", create_room_controller);
room_router.post("/join-room", join_room_controller);
room_router.post("/leave-room", leave_room_controller);
room_router.post("/delete-room", delete_room_controller);

// room_router.get("/get-room/:roomId", (req, res) => {
//     console.log(123);
//     res.send('123');
// })

module.exports = {
    room_router
}