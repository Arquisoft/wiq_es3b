const mongoose  = require("mongoose");
const gameSchema = new mongoose.Schema({
  user: {
    type: String, 
    ref: 'User',
    required: true,
  },
  pAcertadas: {
    type: Number, 
    required: true,
  },
  pFalladas: {
    type: Number, 
    required: true,
  },
  totalTime: {
    type: Number, 
    required: true,
  },
});
module.exports = (connection) => {
  return connection.model('Game', gameSchema);
};