const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: mongoose } = require('mongoose');
const axios = require('axios');

let mongoServer;
let app;
let Game;
let User;
let userId;//used for tests
let connection;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./game-service');
  connection = mongoose.createConnection(mongoUri);
  Game = require('./game-model')(connection);
  User = require('../users/userservice/user-model')(connection);
  
});

afterAll(async () => {
  app.close();
  await connection.close();
  await mongoServer.stop();
});
beforeEach(async () => {
  const user = await User.create({
    username: 'John Doe',
    profileImage: 'defaultProfileImg',
    password: 'password123'
  });
  userId = user._id;
  Game.create({
    user: userId, 
    questions: [
      "609c6e365308ce1a1c2658d8", "609c6e365308ce1a1c2658d9"
    ], 
    answers: [
      {
        response: 'User response',
        isCorrect: false,
      },
      {
        response: 'User response',
        isCorrect: true,
      },
    ],
    totalTime: 180,
  });
  Game.create({
    user: userId, 
    questions: [
      "609c6e365308ce1a1c2658d8", "609c6e365308ce1a1c2658d9"
    ], 
    answers: [
      {
        response: 'User response',
        isCorrect: true,
      },
      {
        response: 'User response',
        isCorrect: true,
      }
    ],
    totalTime: 101,
  });
  Game.create({
    user: '609c6e365308ce1a1c2658',
    questions: [
      "609c6e365308ce1a1c2658d5", "609c6e365308ce1a1c2658d6"
    ], 
    answers: [
      {
        response: 'Another user response',
        isCorrect: false,
      },
      {
        response: 'User response',
        isCorrect: true,
      },
    ],
    totalTime: 180,
  });
});

afterEach(async () => {
  await Game.deleteMany({});
  await User.deleteMany({});
});

describe('Game Service', () => {
  it('should add a new game on POST /addgame', async () => {
    const newGame = {
      user: '609c6e365308ce1a1c2658d1', 
      pAcertadas: 5, 
      pFalladas: 5,
      totalTime: 120, 
    };

    const response = await request(app).post('/addgame').send(newGame);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user', newGame.user.toString());
  });
  it('should get game information on GET /api/info/games', async () => {
    const response = await request(app).get('/api/info/games');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body[0]).toHaveProperty('user');
    expect(response.body[0]).toHaveProperty('questions');
    expect(response.body[0]).toHaveProperty('answers');
    expect(response.body[0]).toHaveProperty('totalTime');
  });



});

describe('GET /getParticipation/:userId', () => {
  it('should return participation data for a valid user', async () => {
    const expectedData = {
      _id: null,
      totalGames: 2,
      correctAnswers: 3,
      incorrectAnswers: 1,
      totalTime: 281,
    };

    const response = await request(app).get(`/getParticipation/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedData);
  });

  it('should return an error for an invalid user', async () => {
    const user = 'invalidUserId';

    const response = await request(app).get(`/getParticipation/${user}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No participation data found for the user.' });
  });
});
describe('Api info users', () => {
  it('should get user information on GET /api/info/users', async () => {
    const axiosMock = jest.spyOn(axios, 'get');
    axiosMock.mockResolvedValue({ data: await User.find() });
    
    const response = await request(app).get('/api/info/users');
    
    expect(response.status).toBe(200);
  });
  it('should get user information on GET /api/info/users?user=X', async () => {
      const axiosMock = jest.spyOn(axios, 'get');
      axiosMock.mockResolvedValue({
         data: await User.findOne({ username: 'John Doe' }) 
      });
    
    const response = await request(app).get('/api/info/users?user=John Doe');
    expect(response.status).toBe(200);
  });
});