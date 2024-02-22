const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
        validator: function (options) {
            return options.length >= 2 && options.length <= 4;
          },
          message: 'Options must have between 2 and 4 elements.',
    },
  },
  correctOptionIndex: {
    type: Number,
    required: true,
    validate: {
      validator: function (index) {
        return index >= 0 && index < 4; // Max of 4 options
      },
      message: 'Correct option index must be between 0 and 3.',
    },
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
