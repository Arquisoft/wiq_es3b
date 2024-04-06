const mongoose = require('mongoose');

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

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;