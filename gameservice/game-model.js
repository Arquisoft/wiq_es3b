const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user: {
    type: String, 
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  incorrectAnswers: {
    type: Number,
    required: true,
  },
  usedTime: {
    type: Number,
    required: true,
  },
  remainingTime: {
    type: Number,
    required: true,
  },
  questions: { 
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    }],
    required: true,
  },
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
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
