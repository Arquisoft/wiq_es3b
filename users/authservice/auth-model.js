const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profileImage: String,
    createdAt: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User