const { Schema } = require('mongoose');
const mongoose = require('../db');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rooms: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Room'
    }]
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
