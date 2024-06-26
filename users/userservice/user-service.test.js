const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
let app;
let User;
let connection;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service'); 
  connection = mongoose.createConnection(mongoUri);
  User = require('./user-model')(connection);

});

afterAll(async () => {
  await app.close();
  await connection.close();
  await mongoServer.stop();
});
beforeEach(async () => {
  await User.create({
    username: 'defaultuser',
    password: 'defaultpassword',
    profileImage: 'default.jpg',
  });
  await User.create({
    username: 'defaultuser2',
    password: 'defaultpassword2',
    profileImage: 'default2.jpg',
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Service', () => {
  it('should add a new user on POST /users', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      profileImage: 'perfil2.jpg',
    };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });
  it('should return an error when adding a user that already exists on POST /users', async () => {
    const existingUser = {
      username: 'defaultuser',
      password: 'testpassword',
      profileImage: 'perfil2.jpg',
    };
    const response = await request(app).post('/users').send(existingUser);
    expect(response.status).toBe(400);
  });
  it('should return an error when adding a user with an empty username on POST /users', async () => {
    const user = {
      username: '',
      password: 'testpassword',
      profileImage: 'perfil2.jpg',
    };
    const response = await request(app).post('/users').send(user);
    expect(response.status).toBe(400);
  });
  it('should return an error when adding a user with an username too long on POST /users', async () => {
    const user = {
      username: 'qwertyuiopasdfghjklñzxcvbnmqwertyuiopasdfghjklñ',
      password: 'testpassword',
      profileImage: 'perfil2.jpg',
    };
    const response = await request(app).post('/users').send(user);
    expect(response.status).toBe(400);
  });
  it('should get user info on GET /users/:username', async () => {
    const username = 'defaultuser';
    const response = await request(app).get(`/users/${username}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', username);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('createdAt');
    expect(Object.keys(response.body)).toHaveLength(3);
  });
  it('should return an error when getting info of a non-existent user on GET /users/:username', async () => {
    const nonExistentUsername = 'nonexistentuser';
    const response = await request(app).get(`/users/${nonExistentUsername}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User not found');
  });


  it('should get all users on GET /users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('_id');
    expect(response.body[0]).toHaveProperty('username');
    expect(response.body[0]).toHaveProperty('createdAt');
    expect(response.body[1]).toHaveProperty('_id');
    expect(response.body[1]).toHaveProperty('username');
    expect(response.body[1]).toHaveProperty('createdAt');
  });
});
