const request = require('supertest');
const axios = require('axios');
let app;

beforeAll(async () => {
  jest.useFakeTimers();
  app = require('./questionGenerationService'); 
});

afterAll(async () => {
    app.close();
    jest.useRealTimers();
});
let iteractions = 100;

describe('Question generation service', () => {
  jest.spyOn(axios, 'post').mockResolvedValue({
    data: {
      question: 'Mocked Question',
      correct: 'Mocked Correct Answer',
      incorrects: ['Mocked Option 1', 'Mocked Option 2'],
      user: 'Mocked User',
      category: 'Mocked Category'
    }
  });

  it('should forward create question request to question generation service. Category: geography', async () => {
    for(let i = 0; i < iteractions; i++){
      const response = await request(app)
        .get('/api/questions/create?category=geography');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('correct');
      expect(response.body).toHaveProperty('incorrects');
    }
  }, 1000000);
  it('should forward create question request to question generation service. Category: sports', async () => {
    for(let i = 0; i < iteractions; i++){
      const response = await request(app)
        .get('/api/questions/create?category=sports');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('correct');
      expect(response.body).toHaveProperty('incorrects');
    }
  }, 1000000);
  it('should forward create question request to question generation service. Category: art', async () => {
    for(let i = 0; i < iteractions; i++){
      const response = await request(app)
        .get('/api/questions/create?category=art');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('correct');
      expect(response.body).toHaveProperty('incorrects');
    }
  }, 1000000);
  it('should forward create question request to question generation service. Category: entertainment', async () => {
    for(let i = 0; i < iteractions; i++){
      const response = await request(app)
        .get('/api/questions/create?category=entertainment');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('correct');
      expect(response.body).toHaveProperty('incorrects');
    }
  }, 1000000);
  it('should forward create question request to question generation service. Category: planets', async () => {
    for(let i = 0; i < iteractions; i++){
      const response = await request(app)
        .get('/api/questions/create?category=planets');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('correct');
      expect(response.body).toHaveProperty('incorrects');
    }
  }, 1000000);
  
  it('should forward create question request to question generation service', async () => {
    for(let i = 0; i < iteractions; i++){
      const response = await request(app)
        .get('/api/questions/create');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('correct');
      expect(response.body).toHaveProperty('incorrects');
    }
  }, 1000000);

});
