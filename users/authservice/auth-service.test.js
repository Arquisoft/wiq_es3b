const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const User = require('./auth-model');

let mongoServer;
let app;

//test user
const user = {
  username: 'testuser',
  password: 'testpassword',
};
const unexpectedUser = {
  username: 'unexpecteduser',
  password: 'password',
};

async function addUser(user){
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });

  await newUser.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./auth-service'); 
  //Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Auth Service', () => {
  it('Should perform a login operation /login', async () => {
    const response = await request(app).post('/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });
  it('Should perform a failed login operation /login', async () => {
    const response = await request(app).post('/login').send(unexpectedUser);
    expect(response.status).toBe(401);
  });
  
  it('Should perform a login operation /verify with a valid token', async () => {
    const response = await request(app).post('/login').send(user);
    const token = response.body.token;
    const response1 = await request(app)
      .get('/verify')
      .set('Authorization', 'Bearer ' + token);
    expect(response1.status).toBe(200);
    expect(response1.body).toHaveProperty('username', 'testuser');
  });

  it('Should perform a login operation /verify with an invalid token', async () => {
    const response = await request(app)
      .get('/verify')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid_payload.82jg44wg5C1A6rV0yJ4gQd');
    expect(response.status).toBe(401);
  });
});
