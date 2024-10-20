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

    const created_room = await new_room.save();

    if(!created_room) {
      return res.status(500).send({message: "Create room thất bại."});
    }
    // Tự động join creater vào room mới tạo
    created_room.members.push(create_data.creater);
    const updatedRoom = await created_room.save();
    
    // Tự động thêm room vào trường rooms của creater
    try {
      const updatedUser = await User.findByIdAndUpdate(
        create_data.creater,
        { $addToSet: { rooms: updatedRoom._id } },
        { new : true }
      );

      if(!updatedUser) {
        return res.status(404).json({message: "Không tìm thấy user nào có id như trên"});
      }
      
    } catch (error) {
      console.error('Lỗi khi thêm room id vào trường rooms của user:', err);
      return res.status(500);
    }

    delete updatedRoom.password;

    res.status(200).send(updatedRoom);
}

const join_room_controller = async (req, res) => {
    const { user_id, room_id } = req.body;

    // Thêm user id vào trường members của room
    let updatedRoom;
    try {
      updatedRoom = await Room.findByIdAndUpdate(
        room_id,
        { $addToSet: { members: user_id } },
        {new : true}
      );

      if(!updatedRoom) {
        return res.status(404).json({message: "Không tim thấy room có id như trên"});
      }
      
    } catch (err) {
      console.error('Lỗi khi thêm user id vào trường members của room:', err);
      return res.status(400).send({error: "ID không hợp lệ"});
    }

    // Thêm room id vào trường rooms của user
    try {
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        { $addToSet: { rooms: room_id } },
        { new : true }
      );

      if(!updatedUser) {
        return res.status(404).json({message: "Không tìm thấy user nào có id như trên"});
      }
      
    } catch (error) {
      console.error('Lỗi khi thêm room id vào trường rooms của user:', err);
      return res.status(500);
    }

    // Gửi về room mới join
    res.status(200).json(updatedRoom);
}

const leave_room_controller = async (req, res) => {
  const { user_id, room_id } = req.body;

    // // Xóa user id trong trường members của room
    // try {
    //   const updatedRoom = await Room.findByIdAndUpdate(
    //     room_id,
    //     { $pull: { members: user_id } },
    //     {new : true}
    //   );

    //   if(!updatedRoom) {
    //     return res.status(404).json({message: "Không tim thấy room có id như trên"});
    //   }
      
    // } catch (err) {
    //   console.error('Lỗi khi thêm user id vào trường members của room:', err);
    //   return res.status(500);
    // }

    // Xóa room id trong trường rooms của user
    try {
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        { $pull: { rooms: room_id } },
        { new : true }
      );

      if(!updatedUser) {
        return res.status(404).json({error: true, message: "Không tìm thấy user nào có id như trên"});
      }
      
    } catch (error) {
      console.error('Lỗi khi thêm room id vào trường rooms của user:', err);
      return res.status(500);
    }

    res.status(200).json({message: 'Rời thành công'});
}

const delete_room_controller = async (req, res) => {
    const { room_id, password } = req.body;
    // console.log(req.body);

    // Tìm đối tượng room đang xét
    const target_room = await Room.findById(room_id);
    if(target_room.password !== password) {
      return res.status(400).send({message: "Mật khẩu phòng không đúng"});
    }

    const members = target_room.members;
    
    // Xóa id của room này trong trường rooms của các member
    try {
      members.forEach(member => {
        User.findByIdAndUpdate(
          member,
          { $pull: { rooms: room_id } },
          {new : true}
        )
      });
    } catch (err) {
      console.error('Lỗi khi xử lý xóa id của room trong trường rooms của các members user:', err);
      return res.status(500);
    }

    // Xóa room
    try {
      const result = await Room.findByIdAndDelete(room_id);
      if (result) {
        console.log('Room', room_id, 'đã được xóa:', result);
      } else {
        console.log('Không tìm thấy room với ID:', id);
      }
    } catch (error) {
      console.error(error);
    }


    res.status(200).json({message: `Đã xóa phòng thành công`});
}

module.exports = { 
    get_room_controller, 
    create_room_controller, 
    join_room_controller,
    leave_room_controller,
    delete_room_controller
}