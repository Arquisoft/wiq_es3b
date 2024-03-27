const request = require('supertest');
const axios = require('axios');
let app; 
beforeAll(async () => {
  app = require('./gateway-service'); 
});
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
    }else if (url.endsWith('/addquestion')) {
      return Promise.resolve({
        data: {
          question: 'Mocked Question',
          correct: 'Mocked Correct Answer',
          incorrects: ['Mocked Option 1', 'Mocked Option 2']
        }
      });
    }
  });
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/api/questions/create')) {
      return Promise.resolve({
        data: {
          question: 'Mocked Question',
          correct: 'Mocked Correct Answer',
          incorrects: ['Mocked Option 1', 'Mocked Option 2']
        }
      });
    }else if(url.endsWith('/api/questions/create?lang=es&category=sports')){
      return Promise.resolve({
        data: {
          question: 'Mocked Question',
          correct: 'Mocked Correct Answer',
          incorrects: ['Mocked Option 1', 'Mocked Option 2']
        }
      });
    } else if (url.endsWith('/api/info/questions')) {
      return Promise.resolve({
      data: [
        {
        question: 'Mocked Question 1',
        correct: 'Mocked Correct Answer 1',
        incorrects: ['Mocked Option 1', 'Mocked Option 2'],
        generationDate: '2022-01-01',
        user: 'mockedUser',
        category: 'mockedCategory'
        },
        {
        question: 'Mocked Question 2',
        correct: 'Mocked Correct Answer 2',
        incorrects: ['Mocked Option 3', 'Mocked Option 4'],
        generationDate: '2022-01-02',
        user: 'mockedUser',
        category: 'mockedCategory'
        }
      ]
      });
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

  // Test /api/info/questions endpoint
  it('should forward info request with id to question service', async () => {
    const response = await request(app)
      .get('/api/info/questions');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual(expect.any(Array));
  });

  // Test /api/info/questions endpoint when service is down
  it('should return an error when the question service is down', async () => {
    // Simulate service down by rejecting the axios.get promise
    const originalGet = axios.get;
    axios.get = jest.fn().mockRejectedValue({ response: { status: 500, data: { error: 'Service down' } } });

    const response = await request(app).get('/api/info/questions');

    expect(response.statusCode).toBe(500);

    axios.get = originalGet;
  });

  // Test /api/questions/create endpoint
  it('should forward create question request to question generation service', async () => {
    const response = await request(app)
      .get('/api/questions/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('correct');
    expect(response.body).toHaveProperty('incorrects');
  },10000);

  it('should forward create question request to question generation service', async () => {
    const response = await request(app)
      .get('/api/questions/create?lang=es&category=sports');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('correct');
    expect(response.body).toHaveProperty('incorrects');
  },10000);


  // Test /api/questions/create endpoint when service is down
  it('should return an error when the question generation service is down', async () => {
    // Simulate service down by rejecting the axios.get promise
    const originalGet = axios.get;
    axios.get = jest.fn().mockRejectedValue({ response: { status: 500, data: { error: 'Service down' } } });

    const response = await request(app).get('/api/questions/create');

    expect(response.statusCode).toBe(500);

    axios.get = originalGet;
  });




  // Test /addquestion endpoint
  it('should add a new question', async () => {
    const response = await request(app)
      .post('/addquestion')
      .send({
        question: 'Mocked Question',
        correct: 'Mocked Correct Answer',
        incorrects: ['Mocked Option 1', 'Mocked Option 2']
      });

    expect(response.statusCode).toBe(200); 
    expect(response.body).toHaveProperty('question', 'Mocked Question');
  });
});