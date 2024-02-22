const express = require('express');
const mongoose = require('mongoose');
const Question = require('./question-model'); // Importa el modelo de preguntas

const app = express();
const port = 8003; // Puerto para el servicio de preguntas

app.use(express.json());

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
    validateRequiredFields(req, ['question', 'options', 'correctOptionIndex']);

    const { question, options, correctOptionIndex } = req.body;

    // Crea una nueva instancia del modelo de preguntas
    const newQuestion = new Question({
      question,
      options,
      correctOptionIndex,
    });

    // Guarda la nueva pregunta en la base de datos
    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// logica para preguntas??

// Conecta a la base de datos de preguntas
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questionsdb';
mongoose.connect(mongoUri);

const server = app.listen(port, () => {
  console.log(`Questions Service listening at http://localhost:${port}`);
});

module.exports = server;