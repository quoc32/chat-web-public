const mongoose = require('mongoose');

// const mongoURI = 'mongodb://localhost:27017/chat-server';
const mongoURI = 'mongodb+srv://vuanhquoc0397144200:2aPeENM7c43rdkws@cluster0.dxbix.mongodb.net/chat_server?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Kết nối MongoDB lỗi:'));
db.once('open', () => {
  console.log('Đã kết nối tới MongoDB');
});

module.exports = mongoose;
