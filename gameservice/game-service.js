const express = require("express");
const mongoose = require("mongoose");
const Game = require("./game-model"); // Importa el modelo de juegos

const app = express();
const port = 8005; // Puerto para el servicio de juegos

app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gamesdb";
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8002";
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
app.post("/addgame", async (req, res) => {
  try {
    validateRequiredFields(req.body, [
      "correctAnswers",
      "incorrectAnswers",
      "usedTime",
      "remainingTime",
      "questions",
      "answers",
      "category",
      "difficulty",
      "date",
    ]);

    const correctAnswers = req.body.correctAnswers;
    const incorrectAnswers = req.body.incorrectAnswers;
    const usedTime = req.body.usedTime;
    const remainingTime = req.body.remainingTime;
    const questions = req.body.questions;
    const answers = req.body.answers;
    const category = req.body.category;
    const difficulty = req.body.difficulty;
    const date = req.body.date;
    let user = null;
    if (req.headers.authorization) {
      const response = await axios.get(`${authServiceUrl}/verify`, {
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      user = response.data.username;
    }

    // Crea una nueva instancia del modelo de juegos
    const newGame = new Game({
      user,
      correctAnswers: correctAnswers,
      incorrectAnswers: incorrectAnswers,
      usedTime: usedTime,
      remainingTime: remainingTime,
      questions: questions,
      answers: answers,
      category,
      difficulty,
      date
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
app.get("/getParticipation/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Consulta para obtener los datos de participación del usuario
    const participationData = await Game.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 }, //$sum -> Returns a sum of numerical values
          correctAnswers: {
            $sum: {
              $size: {
                $filter: {
                  input: "$answers",
                  as: "answer",
                  cond: "$$answer.isCorrect",
                },
              },
            },
          },
          incorrectAnswers: {
            $sum: {
              $size: {
                $filter: {
                  input: "$answers",
                  as: "answer",
                  cond: { $eq: ["$$answer.isCorrect", false] },
                },
              },
            },
          },
          totalTime: { $sum: "$totalTime" },
        },
      },
    ]);

    if (participationData.length === 0) {
      // No se encontraron datos para el usuario
      res
        .status(404)
        .json({ error: "No participation data found for the user." });
      return;
    }

    res.status(200).json(participationData[0]);
  } catch (error) {
    console.error("Error al obtener datos de participación:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const server = app.listen(port, () => {
  console.log(`Games Service listening at http://localhost:${port}`);
});

server.on("close", () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server;
