const express = require('express');
const mongoose = require('mongoose');
const Game = require('./game-model'); // Importa el modelo de juegos

const app = express();
const port = 8005; // Puerto para el servicio de juegos

app.use(express.json());

// Función para validar campos requeridos
const validateRequiredFields = (req, fields) => {
  for (const field of fields) {
    if (!(field in req.body)) {
      throw new Error(`Field '${field}' is required.`);
    }
  }
};

// Ruta para agregar un nuevo juego
app.post('/addgame', async (req, res) => {
  try {
    validateRequiredFields(req, ['user', 'questions', 'answers', 'totalTime']);

    const { user, questions, answers, totalTime } = req.body;

    // Crea una nueva instancia del modelo de juegos
    const newGame = new Game({
      user,
      questions,
      answers,
      totalTime,
    });

    // Guarda el nuevo juego en la base de datos
    const savedGame = await newGame.save();

    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Lógica para juegos??

// Conecta a la base de datos de juegos
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamesdb';
mongoose.connect(mongoUri);

const server = app.listen(port, () => {
  console.log(`Games Service listening at http://localhost:${port}`);
});

module.exports = server;