const express = require('express');
const mongoose = require('mongoose');
const Game = require('./game-model'); 

const app = express();
const port = 8005; // Puerto para el servicio de juegos

app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamesdb';
mongoose.connect(mongoUri);

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
      user: mongoose.Types.ObjectId(user), // Cambio aquí
      questions: mongoose.Types.ObjectId(questions),
      answers,
      totalTime,
    });

    console.log(newGame);

    // Guarda el nuevo juego en la base de datos
    const savedGame = await newGame.save();

    res.status(200).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener datos de participación del usuario
app.get('/getParticipation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('User ID:', userId);

    if (!userId) {
      // Si no se encuentra el usuario, responder con un error
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Consulta para obtener los datos de participación del usuario
    console.log('Querying participation data...');
    const participationData = await Game.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 }, //$sum -> Retorna la suma de los valores numéricos
          correctAnswers: { $sum: { $size: { 
            $filter: {
               input: "$answers", as: "answer", cond: "$$answer.isCorrect" } 
          } } },
          incorrectAnswers: { $sum: { $size: {
            $filter: { input: "$answers", as: "answer", cond: { $eq: ["$$answer.isCorrect", false] } } 
          } } },
          totalTime: { $sum: "$totalTime" },
        },
      },
    ]);

    console.log('Participation data:', participationData);

    if (participationData.length === 0) {
      // No se encontraron datos para el usuario
      console.log('No participation data found for the user.');
      res.status(404).json({ error: 'No participation data found for the user.' });
      return;
    }

    console.log('Sending participation data:', participationData[0]);
    res.status(200).json(participationData[0]);
  } catch (error) {
    console.error('Error al obtener datos de participación:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const server = app.listen(port, () => {
  console.log(`Games Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server;