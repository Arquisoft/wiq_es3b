const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = (connection) => {
  return connection.model('User', userSchema);
};
