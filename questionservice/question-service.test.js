const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri; 
  app = require('./question-service'); 
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Question Service', () => {
  it('should add a new question on POST /addquestion', async () => {
    const newQuestion = {
      question: 'Mocked Question',
      correct: 'Mocked Correct Answer',
      incorrects: ['Mocked Option 1', 'Mocked Option 2']
    };

    const response = await request(app).post('/addquestion').send(newQuestion);
    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('question', 'Mocked Question');
  });
  
});
