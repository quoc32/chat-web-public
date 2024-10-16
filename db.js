const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/chat-server';

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Kết nối MongoDB lỗi:'));
db.once('open', () => {
  console.log('Đã kết nối tới MongoDB');
});

module.exports = mongoose;
