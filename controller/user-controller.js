const User = require('../model/User');

const login_controller = async (req, res) => {
    const data = req.body;
    try {
        let user = await User.findOne(data);
        if(!user) {
            user = {error: "Thông tin đăng nhập không hợp lệ."};
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const get_user_controller = async (req, res) => {
    const userId = req.params.userId;
    // console.log(userId);
    try {
        const user = await User.findById(userId).select('-password -rooms');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const register_controller = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(user) {
            user = {error: "Người dùng với email đã tồn tại."};
            res.status(200).json(user);
        } else {
            // console.log(req.body);
            const newUser = new User({name, email, password});

            try {
                const save_result = await newUser.save();
                res.status(201).json(save_result);
            } catch (err) {
                res.status(400).json({ message: err.message });
            }

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { 
    login_controller, 
    get_user_controller, 
    register_controller
}