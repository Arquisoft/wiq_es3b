const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./game-service');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
});

afterAll(async () => {
  await mongoServer.stop();
});

describe('Game Service', () => {
  it('should add a new game on POST /addgame', async () => {
    const newGame = {
      user: mongoose.Types.ObjectId(), // ID de usuario simulado
      questions: mongoose.Types.ObjectId(), // ID de pregunta simulado
      answers: [
        {
          response: 'User response',
          isCorrect: true,
        },
      ],
      totalTime: 120, // Tiempo total de la partida en segundos
    };

    const response = await request(app).post('/addgame').send(newGame);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user', newGame.user.toString());
  });
});
