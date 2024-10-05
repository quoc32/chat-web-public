
const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;
const MGclient = new MongoClient(DATABASE_URL);

async function loadUser(name) {
    let user = {};
    try {
        const database = MGclient.db(DATABASE_NAME);
        const users = database.collection('Users');
        user = await users.findOne({name: name});
    } catch(err) {
        console.error(err);
    } finally {
        return user;
    }
}
async function loadUser_byId(id) {
    let user = {};
    try {
        const database = MGclient.db(DATABASE_NAME);
        const users = database.collection('Users');
        user = await users.findOne({_id: new ObjectId(id)});
    } catch(err) {
        console.error(err);
    } finally {
        user._id = user._id.toHexString();
        user.rooms = user.rooms.map(room_id => room_id.toHexString());
        return user;
    }
}
async function loadRoom(room_id) {
    let room = {};
    try {
        const database = MGclient.db(DATABASE_NAME);
        const rooms = database.collection('Rooms');
        room = await rooms.findOne({_id: new ObjectId(room_id)});
    } catch(err) {
        console.error(err);
    } finally {
        room._id = room._id.toHexString();
        (room.messages).forEach(message => {
            message["sender-id"] = message['sender-id'].toHexString();
        });
        return room;
    }
}

module.exports = {
    loadUser,
    loadRoom,
    loadUser_byId,
    MGclient,
}