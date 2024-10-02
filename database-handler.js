
async function getUser(name) {
    const { MongoClient } = require("mongodb");
    const DATABASE_URL = process.env.DATABASE_URL;
    const DATABASE_NAME = process.env.DATABASE_NAME;
    const client = new MongoClient(DATABASE_URL);
    let user = {};
    try {
        const database = client.db(DATABASE_NAME);
        const users = database.collection('Users');
        user = await users.findOne({name: name});
    } catch(err) {
        console.error(err);
    } finally {
        await client.close();
        return user;
    }
}
async function getRoom(room_id) {
    const { MongoClient, ObjectId } = require("mongodb");
    const DATABASE_URL = process.env.DATABASE_URL;
    const DATABASE_NAME = process.env.DATABASE_NAME;
    const client = new MongoClient(DATABASE_URL);
    let room = {};
    try {
        const database = client.db(DATABASE_NAME);
        const rooms = database.collection('Rooms');
        room = await rooms.findOne({_id: new ObjectId(room_id)});
    } catch(err) {
        console.error(err);
    } finally {
        await client.close();
        return room;
    }
}

module.exports = {
    getUser,
    getRoom
}