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
    pAcertadas: 5,
    pFalladas: 3,
    totalTime: 1200,
    gameMode: 'classic'
  });
});

afterEach(async () => {
  await Game.deleteMany({});
  await User.deleteMany({});
});

describe('Game Service', () => {
  // Test para agregar un nuevo juego con éxito
  it('should add a new game on POST /games', async () => {
    const newGame = {
      userId: userId,
      pAcertadas: 5,
      pFalladas: 3,
      totalTime: 1200,
      gameMode: 'classic'
    };

    const response = await request(app).post('/games').send(newGame);
    expect(response.status).toBe(200);
    const data = response.body;
    expect(data).toHaveProperty("user");
    expect(data.user.toString()).toBe(newGame.userId.toString());
    expect(data).toHaveProperty('pAcertadas', newGame.pAcertadas);
    expect(data).toHaveProperty('pFalladas', newGame.pFalladas);
    expect(data).toHaveProperty('totalTime', newGame.totalTime);
    expect(data).toHaveProperty('gameMode', newGame.gameMode);
    expect(data).toHaveProperty('date');
  });


  // Test para obtener los datos de participación de un usuario existente
  it('should return participation data for existing user', async () => {

    const mockParticipationData = {
      _id: null,
      totalGames: 1,
      correctAnswers: 5,
      incorrectAnswers: 3,
      totalTime: 1200,
      classic: 1,
      infinite: 0,
      threeLife: 0,
      category: 0,
      custom: 0,
    };

    

    const response = await request(app).get(`/games/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockParticipationData);
  });

  // Test para manejar el caso de usuario no encontrado al obtener los datos de participación
  it('should return 404 when getting participation data for invalid user', async () => {
    const nonExistentUserId = '';
    const response = await request(app).get(`/games/${nonExistentUserId}`);

    expect(response.status).toBe(404);
  });
  it('should return 204 when getting participation data for user with totalGames equal to 0', async () => {
    const userNoGames = await User.create({
      username: 'noGames',
      profileImage: 'defaultProfileImg',
      password: 'password123'
    });
    const userNGId = userNoGames._id;
  
    const response = await request(app).get(`/games/${userNGId}`);
  
    expect(response.status).toBe(204);
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
// Test para obtener información de juegos sin filtros
it('should get game information on GET /api/info/games', async () => {
  const response = await request(app).get('/api/info/games');
  expect(response.status).toBe(200);
});

// Test para obtener información de un juego por ID
it('should get game information by ID on GET /api/info/games?id=<gameId>', async () => {
  const gameId = 'gameId';
  const response = await request(app).get(`/api/info/games?id=${gameId}`);
  expect(response.status).toBe(200);
});

// Test para obtener información de juegos por usuario
it('should get game information by user on GET /api/info/games?user=<userId>', async () => {
  const userId = 'userId';
  const response = await request(app).get(`/api/info/games?user=${userId}`);
  expect(response.status).toBe(200);
});

// Test para obtener información de juegos sin usuario
it('should get game information without user on GET /api/info/games?user=', async () => {
  const response = await request(app).get('/api/info/games?user=');
  expect(response.status).toBe(200);
});