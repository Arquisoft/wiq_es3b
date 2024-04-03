const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user: {
    type: String, 
    ref: 'User',
    required: true,
  },
  questions: [{ 
    type: String,
    ref: 'Question',
    required: true,
  }],
  answers: [
    {
      response: {
        type: String,
        required:  true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    }
  ],
  totalTime: {
    type: Number, 
    required: true,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;