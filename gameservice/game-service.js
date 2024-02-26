const express = require('express');
const mongoose = require('mongoose');requeridos
const Game = require('./game-model'); // Importa el modelo de preguntas

const app = express();
const port = 8005; // Puerto para el servicio de preguntas

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
app.post('/addgame', async (req, res) => {
  try {
    validateRequiredFields(req, ['user', 'questions', 'answers', 'time']);

    const { user, questions, answers, time } = req.body;

    // Crea una nueva instancia del modelo de games
    const newGame = new Game({
      user,
      questions,
      answers,
      time,
    });

    // Guarda el nuevo Game en la base de datos
    const savedGame = await newGame.save();

    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// logica para games??

// Conecta a la base de datos de games
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamesdb';
mongoose.connect(mongoUri);

const server = app.listen(port, () => {
  console.log(`Games Service listening at http://localhost:${port}`);
});

module.exports = server;