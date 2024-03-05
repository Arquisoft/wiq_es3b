const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  correct: {
    type: String,
    required: true,
  },
  incorrects: {
    type: [String],
    required: true,
    validate: {
        validator: function (options) {
            return options.length >= 1 && options.length <= 3;
          },
          message: 'Options must be between 2 and 4 elements.',
    },
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;