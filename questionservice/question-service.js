const express = require('express');
const mongoose = require('mongoose');
const Question = require('./question-model'); // Importa el modelo de preguntas

const app = express();
const port = 8004; // Puerto para el servicio de preguntas

app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questionsdb';
mongoose.connect(mongoUri);

// Función para validar campos requeridos
const validateRequiredFields = (req, fields) => {
  for (const field of fields) {
    if (!(field in req.body)) {
      throw new Error(`Field '${field}' is required.`);
    }
  }
};


const addQuestion = async (req, res) => {
  try {
    validateRequiredFields(req, ['question', 'correct', 'incorrects', 'user', 'category']);

    const { question, correct, incorrects, user, category } = req.body;

    // Crea una nueva instancia del modelo de preguntas
    const newQuestion = new Question({
      question,
      correct,
      incorrects,
      user,
      category
    });

    // Guarda la nueva pregunta en la base de datos
    const savedQuestion = await newQuestion.save();

    res.status(200).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Ruta para agregar una nueva pregunta
app.post('/addquestion', addQuestion);


app.get('/api/info/questions', async (req, res) => {
  try {
    const { id, user, category } = req.query;
    let query = {};

    if (id) query._id = id.toString();
    if (user !== undefined) query.user = user === '' ? null : user.toString();
    if (category) query.category = category.toString();

    const questions = await Question.find(query);
    if (!questions) {
      return res.status(404).json({ error: 'No questions found' });
    }
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Questions Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server;
module.exports.addQuestion = addQuestion;
