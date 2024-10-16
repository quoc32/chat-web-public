const { Schema } = require('mongoose');
const mongoose = require('../db');

const msgSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  msgs: [msgSchema]
});

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;
