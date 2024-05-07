const axios = require('axios');

const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
let Friends;
let User;

let mongoServer;
let app;
let userApp;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri; 
    app = require('./friends-service'); 
    userApp = require('../userservice/user-service');
    const connectionFriends = mongoose.createConnection(mongoUri);
    Friends = await require('./friends-model')(connectionFriends);
    const connectionUsers = mongoose.createConnection(mongoUri);
    User = await require('../userservice/user-model')(connectionUsers);
});
beforeEach(async () => {
    await Friends.create({
      username: 'user1',
      friends: ['user2', 'user3']
    });
    await User.create({
        username: 'user1',
        password: 'password123',
        profileImage: 'defaultProfileImg',
        createdAt: new Date('2022-01-01')
    });
     await User.create({
        username: 'user2',
        password: 'password123',
        profileImage: 'defaultProfileImg',
        createdAt: new Date('2022-01-01')
    });
    await User.create({
        username: 'user3',
        password: 'password123',
        profileImage: 'defaultProfileImg',
        createdAt: new Date('2022-01-01')
    });
    await User.create({
        username: 'user4',
        password: 'password123',
        profileImage: 'defaultProfileImg',
        createdAt: new Date('2022-01-01')
    });
    

});
  
afterEach(async () => {
    await Friends.deleteMany({});
    await User.deleteMany({});
    
    
});
jest.mock('axios');


describe('GET /friends/:username', () => {
    it('should return the friends of the specified user', async () => {
        jest.mock('axios');
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200 }));
        const response = await request(app).get('/friends/user1');
        expect(response.body).toEqual({ username: 'user1', friends: ['user2', 'user3'] });
    });

    it('should return an error if the username does not exist', async () => {
        const response = await request(app).get('/friends/invalid-username');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({error: 'User not found'});
    });

    // Add more test cases for different scenarios
});

describe('POST /friends', () => {
    it('should add a friend to the user', async () => {
        jest.mock('axios');
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: 'mocked data' }));

        const mockUser = { username: 'user2', friends: ['user1'] };

        const response = await request(app)
            .post('/friends')
            .send({ user: 'user2', friend: 'user1' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
    it('should add a existing friend to the user', async () => {
        jest.mock('axios');
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: 'mocked data' }));

        const response = await request(app)
            .post('/friends')
            .send({ user: 'user1', friend: 'user2' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Friend already exists" });
    });
    it('should add a other friend to a user with previous friends', async () => {
        jest.mock('axios');
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: 'mocked data' }));
        const mockUser = { username: 'user1', friends: ['user2','user3','user4'] };
        const response = await request(app)
            .post('/friends')
            .send({ user: 'user1', friend: 'user4' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
    it('should return an error if the user and friend are the same', async () => {
        const response = await request(app).post('/friends').send({user: 'user1', friend: 'user1'});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'User and friend cannot be the same' });
    });

    it('should return an error if the user is not provided', async () => {
        const response = await request(app).post('/friends/').send({friend: 'friend2'});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'User and friend are required' });
    });
    it('should return an error if the user does not exists', async () => {
        const response = await request(app).post('/friends/').send({user: 'invalid-username', friend: 'invalid-friend'});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'User not found' });
    });
});

    // Add more test cases for different scenarios

describe('DELETE /friends/:username/:friend', () => {
    it('should delete a friend from the user', async () => {
        const mockUser = { username: 'user1', friends: ['user2'] };

        const response = await request(app).delete('/friends/user1/user3');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it('should return an error if the user or friend is not provided', async () => {
        const response = await request(app).delete('/friends/user1/invalid-friend');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Friend not found'});
    });

    // Add more test cases for different scenarios
});

// Add more test cases for other endpoints and scenarios

afterAll(() => {
    // Close the Mongoose connection
    mongoose.connections.forEach(connection => {
        connection.close();
    });
    app.close();
    userApp.close();
    mongoServer.stop();
});