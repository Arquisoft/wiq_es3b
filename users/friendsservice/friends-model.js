const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    friends: {
        type: [String],
        default: [],
        validate: {
            validator: function(arr) {
                return new Set(arr).size === arr.length;
            },
            message: 'Each friend must be unique.'
        }
    },
});

module.exports = (connection) => {
  return connection.model('User', friendsSchema);
};
