const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const USER_SERVICE_URL=process.env.USER_SERVICE_URL || 'http://localhost:8001';


const app = express();
const port = 8005; // Puerto para el servicio de juegos

app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamesdb';
const gameConnection=mongoose.createConnection(mongoUri);
const Game = require('./game-model')(gameConnection); 

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
      user: user, 
      questions: questions,
      answers,
      totalTime,
    });

    // Guarda el nuevo juego en la base de datos
    const savedGame = await newGame.save();

    res.status(200).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/info/games', async (req, res) => {
  try {
    const { id, user} = req.query;
    let query = {};

    if (id) query._id = id;
    if (user !== undefined) query.user = user === '' ? null : user;
    const game = await Game.find(query);
    if (!game) {
      return res.status(404).json({ error: 'No information for games found' });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/info/users', async (req, res) => {
  try {
    const username=req.query.user;
    let usersData=[];
    if(username!=undefined){
      try{
        const user = await axios.get(`${USER_SERVICE_URL}/getUserInfo/${username}`)
        if (!user.data) {
          res.status(400).json({ error: 'User not found' });
          return;
        }
        else{
          usersData.push(user.data);
        }
      }catch(error){
        res.status(400).json({ error: error.message });
        return;
      }
    }else{
      try {
        const users = await axios.get(`${USER_SERVICE_URL}/getAllUsers`);
        if(users.data)
          users.data.forEach(user => {usersData.push(user)});
      } catch (error) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    let data=usersData;
    for (let i = 0; i < usersData.length; i++) {
      let game = await Game.find({ user: data[i]._id });
      if (game.data) {
        console.log(data[i]);
        if (!data[i]) {
          data[i] = [];
        }
        data[i].push(game.data);
      }
    }
    res.status(200).json(data);
    return;
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
  mongoose.connections.forEach(connection => {
    connection.close();
  });
});

module.exports = server;