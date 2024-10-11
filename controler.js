
const { loadUser, loadRoom, loadUser_byId, add_user } = require("./database")

const load_user_controller = (req, res) => {
    const user_id = req.params.user_id;
    loadUser_byId(user_id)
        .then((user) => {
            console.log(user);
            res.send({_id: user._id, name: user.name});
        })
}

const load_admin_controller = (req, res) => {
    const data = req.body;
    console.log(data);
    loadUser(data.name)
        .then((admin) => {
            console.log(admin);
            if(admin) {
                if(admin?.password === data.password) {
                    res.send(admin);
                } else {
                    res.send({error: "wrong password"});
                }
            } else {
                res.send({ error: "user not found" });
            }
        })
}
const load_rooms_controller = (req, res) => {
    const room_id = req.params.room_id;
    loadRoom(room_id)
        .then((room) => {
            res.send(room);
        })
}

const add_user_controller = (req, res) => {
    const user = res.body;
    
    add_user(user)
        .then(result => {
            res.send(result);
        })
}

module.exports = {
    load_user_controller,
    load_rooms_controller,
    load_admin_controller,
    add_user_controller
}