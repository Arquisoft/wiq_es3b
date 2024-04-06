const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./game-service');
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
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
});
