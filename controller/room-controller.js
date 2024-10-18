const Room = require('../model/Room')
const User = require('../model/User')

const get_room_controller = async (req, res) => {
  const roomId = req.params.roomId;
    try {
      const room = await Room.findById(roomId).select('-password');
      if (!room) {
          return res.status(404).json({ message: 'Phòng không tồn tại' });
      }
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

const create_room_controller = async (req, res) => {
    const create_data = req.body;

    const new_room = new Room({
        name: create_data.name,
        password: create_data.password
    })

    const create_result = await new_room.save();

    res.send(create_result);
}

const join_room_controller = async (req, res) => {
    const { user_id, room_id } = req.body;

    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        room_id,
        { $addToSet: { members: user_id } },
        {new : true}
      );

      if(!updatedRoom) {
        return res.status(404).json({message: "room not found"});
      }
      
      // console.log('Đã thêm user_id vào trường members:', updatedRoom);
      
    } catch (err) {
      console.error('Lỗi khi thêm user_id vào trường members:', err);
      return res.status(500);
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        { $addToSet: { rooms: room_id } },
        { new : true }
      );

      if(!updatedUser) {
        return res.status(404).json({message: "user not found"});
      }
      
      // console.log('Đã thêm room vào trường rooms:', updatedUser);
      res.status(200).json({message: 'Thêm thành công'})
    } catch (error) {
      console.error('Lỗi khi thêm room vào trường rooms:', err);
      return res.status(500);
    }
}

module.exports = { 
    get_room_controller, 
    create_room_controller, 
    join_room_controller 
}