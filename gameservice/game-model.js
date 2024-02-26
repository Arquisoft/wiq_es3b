const mongoose = require('mongoose');

//usuario, preguntas[], respuestas[], tiempo

const gameSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  questions: {
    type: [String],
    required: true,
  },
  answers: {
    type: [Number],
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

const Game = mongoose.model('game', gameSchema);

module.exports = Game;
