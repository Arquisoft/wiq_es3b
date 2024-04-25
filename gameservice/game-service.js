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
    validateRequiredFields(req, ['user', 'pAcertadas', 'pFalladas', 'totalTime', 'gameMode']);

    const { user, pAcertadas, pFalladas, totalTime, gameMode } = req.body;

    // Crea una nueva instancia del modelo de juegos
    const newGame = new Game({
      user: user, 
      pAcertadas: pAcertadas,
      pFalladas: pFalladas,
      totalTime: totalTime,
      gameMode: gameMode
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
    const {user} = req.query;
    let query = {};

    if (user !== undefined) {//filtra por el id del usuario
      query.user = user === '' ? null : user;
    }

    const game = await Game.find(query);
    if (!game) {
      return res.status(404).json({ error: 'No information for games found' });
    }
    const modifiedGame = game.map(g => {
      const { pAcertadas, pFalladas, ...rest } = g._doc;
      return {
      ...rest,
      correctAnswers: pAcertadas,
      incorrectAnswers: pFalladas
      };
    });
    res.status(200).json(modifiedGame);
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
      let games = await Game.find({ user: data[i]._id });
      let correctAnswers=0;
      let incorrectAnswers=0;
      let totalTime=0;
      let totalGames=0;
      games.forEach(game => {
        if(game.pAcertadas)
          correctAnswers += game.pAcertadas;
        if(game.pFalladas)
          incorrectAnswers += game.pFalladas;
        if(game.totalTime)
          totalTime += game.totalTime;
        totalGames++;
      });
      data[i].correctAnswers = correctAnswers;
      data[i].incorrectAnswers = incorrectAnswers;
      data[i].totalTime = totalTime;
      data[i].totalGames = totalGames;
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

    // Verificar si el userId recibido es un string vacío o nulo
    if (!userId || userId.trim() === '') {
      res.status(404).json({ error: 'Invalid User ID' });
      return;
    }
    
    // Consulta para obtener los datos de participación del usuario
    const participationData = await Game.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          correctAnswers: { $sum: "$pAcertadas" },
          incorrectAnswers: { $sum: "$pFalladas" },
          totalTime: { $sum: "$totalTime" },
          classic: {
            $sum: { $cond: [{ $eq: ["$gameMode", "classic"] }, 1, 0] }
          },
          infinite: {
            $sum: { $cond: [{ $eq: ["$gameMode", "infinite"] }, 1, 0] }
          },
          threeLife: {
            $sum: { $cond: [{ $eq: ["$gameMode", "threeLife"] }, 1, 0] }
          },
          category: {
            $sum: { $cond: [{ $eq: ["$gameMode", "category"] }, 1, 0] }
          },
          custom: {
            $sum: { $cond: [{ $eq: ["$gameMode", "custom"] }, 1, 0] }
          }
        },
      },
    ]);    

    if (participationData.length === 0 || (participationData.length > 0 && participationData[0].totalGames === 0)) {
      // No se encontraron datos para el usuario
      res.status(204).json({ error: 'No participation data for the user' });
      return;
    }

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