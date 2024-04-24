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
    if (url.endsWith('/adduser')) {
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
     if(url.endsWith('/api/questions/create?lang=es&category=sports')){
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
  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'mockedToken' } });
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
  });

  it('should return an error when the user service is down', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({ response: { status: 500, data: { error: 'Service down' } } });
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Service down' });
  });
  // Test /verify endpoint
  it('should verify authorization token with auth service', async () => {
    const mockedToken = 'mockedToken';
    const authResponse = { username: 'testuser' };
    axios.get.mockResolvedValueOnce({ data: authResponse });
    const response = await request(app)
      .get('/verify')
      .set('Authorization', `Bearer ${mockedToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(authResponse);
  });
  it("should return 401 Unauthorized for unauthorized request", async () => {
    const response = await request(app).get("/verify");
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });
  // Test /verify endpoint when auth service is down
  it('should return an error when the auth service is down', async () => {
    const mockedToken = 'mockedToken';
    axios.get.mockImplementation({ response: { status: 500, data: { error: 'Service down' } } });
    const response = await request(app)
      .get('/verify')
      .set('Authorization', `Bearer ${mockedToken}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Service down' });
  });

  // Test /verify endpoint when auth service returns an error
  it('should return an error when the auth service returns an error', async () => {
    const mockedToken = 'mockedToken';
    const mockedError = { error: 'Unauthorized' };
    axios.get.mockRejectedValueOnce({ response: { status: 401, data: mockedError } });
    const response = await request(app)
      .get('/verify')
      .set('Authorization', `Bearer ${mockedToken}`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(mockedError);
  });




  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });
  it('should return an error when the user service is down', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 500, data: { error: 'Service down' } } });
    const response = await request(app)
    .post('/adduser')
    .send({ username: 'testuser', password: 'testpassword' });
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Service down' });
  });

  // Test /api/info/questions endpoint
  it('should forward info request with id to question service', async () => {
    axios.get.mockResolvedValueOnce({ data: { question: 'Mocked Question', correct: 'Mocked Correct Answer', incorrects: ['Mocked Option 1', 'Mocked Option 2'] } });
    const response = await request(app)
      .get('/api/info/questions');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual({ question: 'Mocked Question', correct: 'Mocked Correct Answer', incorrects: ['Mocked Option 1', 'Mocked Option 2'] });
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
    axios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          question: 'Mocked Question',
          correct: 'Mocked Correct Answer',
          incorrects: ['Mocked Option 1', 'Mocked Option 2']
        }
      });
    });
    const response = await request(app)
      .get('/api/questions/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('correct');
    expect(response.body).toHaveProperty('incorrects');
  },10000);
  it('should return an error when the user service is down', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 500, data: { error: 'Service down' } } });
    const response = await request(app)
    .get('/api/questions/create')
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Service down' });
  });

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
describe('addGame', () =>{
  it('should return 401 Unauthorized if authorization token is missing', async () => {
    const response = await request(app).post('/addgame');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('should return 401 Unauthorized if authorization token is invalid', async () => {
    const mockedToken = 'invalidToken';
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });
    const response = await request(app)
      .post('/addgame')
      .set('Authorization', `Bearer ${mockedToken}`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });
});
describe('POST /addfriend', () => {
  it('should skip the middleware and return 401 Unauthorized if authorization token is missing', async () => {
    const response = await request(app).post('/addfriend');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('should skip the middleware and return 401 Unauthorized if authorization token is invalid', async () => {
    const mockedToken = 'invalidToken';
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });
    const response = await request(app)
      .post('/addfriend')
      .set('Authorization', `Bearer ${mockedToken}`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('should skip the middleware and call the next middleware if authorization token is valid', async () => {
    const mockedToken = 'validToken';
    const mockedResponse = { status: 200, data: { username: 'mockedUser' } };
    axios.post.mockResolvedValueOnce(mockedResponse);
    axios.get.mockResolvedValueOnce(mockedResponse);
    const nextMiddleware = jest.fn();

    await request(app)
      .post('/addfriend')
      .send({ username: 'mockedUser', friend: 'mockedFriend'})
      .set('Authorization', `Bearer ${mockedToken}`);
      nextMiddleware(); 
    expect(nextMiddleware).toHaveBeenCalled();
  });
});
describe('Friend Service', () => {
  

  // Test middleware for deletefriend endpoint
  it('should call the next middleware if authorization token is valid', async () => {
    const mockedToken = 'validToken';
    const mockedResponse = { status: 200, data: { username: 'mockedUser' } };
    axios.delete.mockResolvedValueOnce(mockedResponse);
    axios.get.mockResolvedValueOnce(mockedResponse);
    await request(app)
      .delete('/deletefriend/testuser/friend')
      .set('Authorization', `Bearer ${mockedToken}`);
  });
  it('should return 401 Unauthorized if authorization token is missing', async () => {
    const response = await request(app).delete('/deletefriend/testuser/friend');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });
  it('should return 401 Unauthorized if authorization token is invalid', async () => {
    const mockedToken = 'invalidToken';
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });
    const response = await request(app)
      .delete('/deletefriend/testuser/friend')
      .set('Authorization', `Bearer ${mockedToken}`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  // Test /getFriends endpoint
  it('should forward get friends request to friend service', async () => {
    const mockedUsername = 'testuser';
    const mockedFriends = ['friend1', 'friend2'];
    axios.get.mockResolvedValueOnce({ data: mockedFriends , status: 200});
    const response = await request(app)
      .get(`/getFriends/${mockedUsername}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockedFriends);
  });
  it('should return an error when the friend service is down', async () => {
    const mockedUsername = 'testuser';
    const mockedError = { error: 'Service down' };
    jest.spyOn(axios, 'get').mockImplementation({ response: { status: 500, data: { error: 'Service down' } } });
    const response = await request(app)
      .get(`/getFriends/${mockedUsername}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(mockedError);
  });
});