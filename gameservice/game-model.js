const mongoose = require('mongoose');

//usuario, preguntas[], respuestas[<String, bool>], tiempo

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  questions: { 
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Question',
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
  totalTime: {
    type: Number, 
    required: true,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
