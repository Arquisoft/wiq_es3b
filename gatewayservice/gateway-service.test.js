const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    }
  });
   // Test /health endpoint
   it('should give information of the status', async () => {
    const response = await request(app)
      .get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  // Test /api/questions/create endpoint
  it('should forward create question request to question generation service', async () => {
    const response = await request(app)
      .get('/api/questions/create');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('correct');
    expect(response.body).toHaveProperty('incorrects');
  },100000);
 /*  
  // Test /addquestion endpoint
  it('should add a new question', async () => {
    const response = await request(app)
      .post('/addquestion')
      .send({
        question: 'What is the capital of France?',
        options: ['Paris', 'Berlin', 'Madrid', 'Rome'],
        correctOptionIndex: 0,
      });

    expect(response.statusCode).toBe(200); 
    expect(response.body).toHaveProperty('question', 'What is the capital of France?');
  }); */
});