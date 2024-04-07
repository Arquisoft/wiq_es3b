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
    }else if(url.endsWith('/verify')){
      return Promise.resolve({ data: { username: 'testuser' } });
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
  // Test /verify endpoint
  it('should verify authorization token with auth service', async () => {
    const response = await request(app)
      .get('/verify')
      .set('Authorization', 'Bearer mockedToken');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
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

  
});
describe('GET /getParticipation/:userId', () => {
  it('should return the participation of the user', async () => {
    const mockedUserId = 'mockedUserId';
    const mockedGameResponse = { participation: 10 };

    axios.get.mockResolvedValueOnce({ data: mockedGameResponse });

    const response = await request(app).get(`/getParticipation/${mockedUserId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockedGameResponse);
  });

  it('should return an error when the game service returns an error', async () => {
    const mockedUserId = 'mockedUserId';
    const mockedError = { error: 'Service down' };

    axios.get.mockRejectedValueOnce({ response: { status: 500, data: mockedError } });

    const response = await request(app).get(`/getParticipation/${mockedUserId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(mockedError);
  });
});
describe('GET /api/info/users', () => {
  it('should return user information', async () => {
    const mockedUsername = 'mockedUser';
    const mockedInfoResponse = { 
      id: 'mockedUserId',
      username: 'mockedUser',
      createdAt: '2022-01-01',
      questions: ['Mocked Question 1', 'Mocked Question 2'],
      answers: ['Mocked Answer 1', 'Mocked Answer 2']
    };

    axios.get.mockResolvedValueOnce({ data: mockedInfoResponse });

    const response = await request(app).get(`/api/info/users?user=${mockedUsername}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockedInfoResponse);
  });

  it('should return an error when the user service is down', async () => {
    const mockedUsername = 'mockedUser';
    const mockedError = { error: 'Service down' };

    axios.get.mockRejectedValueOnce({ response: { status: 500, data: mockedError } });

    const response = await request(app).get(`/api/info/users?user=${mockedUsername}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(mockedError);
  });
});
describe('GET /api/info/games', () => {
  it('should return game information', async () => {
    const mockedUsername = 'mockedUser';
    const mockedInfoResponse = { 
      id: 'mockedGameId',
      totalTime: 135,
      answers: ['User 1', 'User 2'],
      questions: ['Question 1', 'Question 2']
    };
    axios.get.mockResolvedValueOnce({ data: mockedInfoResponse });

    const response = await request(app).get(`/api/info/games?user=${mockedUsername}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockedInfoResponse);
  });

  it('should return an error when the game service is down', async () => {
    const mockedUsername = 'mockedUser';
    const mockedError = { error: 'Service down' };

    axios.get.mockRejectedValueOnce({ response: { status: 500, data: mockedError } });

    const response = await request(app).get(`/api/info/games?user=${mockedUsername}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(mockedError);
  });
});

