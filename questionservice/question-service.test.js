const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./question-service'); 

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri; 
});

afterAll(async () => {
  await mongoServer.stop();
});

describe('Question Service', () => {
  it('should add a new question on POST /addquestion', async () => {
    const newQuestion = {
      question: 'What is the capital of France?',
      options: ['Paris', 'Berlin', 'Madrid', 'Rome'],
      correctOptionIndex: 0,
    };

    const response = await request(app).post('/addquestion').send(newQuestion);
    expect(response.status).toBe(201); 
    expect(response.body).toHaveProperty('question', 'What is the capital of France?');
  });
  
});
