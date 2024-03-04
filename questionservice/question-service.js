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

// Ruta para agregar una nueva pregunta
app.post('/addquestion', async (req, res) => {
  try {
    validateRequiredFields(req, ['question', 'correct', 'incorrects']);

    const { question, correct, incorrects } = req.body;

    // Crea una nueva instancia del modelo de preguntas
    const newQuestion = new Question({
      question,
      correct,
      incorrects,
    });

    // Guarda la nueva pregunta en la base de datos
    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// logica para preguntas??

const server = app.listen(port, () => {
  console.log(`Questions Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server;