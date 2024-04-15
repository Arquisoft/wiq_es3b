// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 8006;

// Middleware to parse JSON in request body
app.use(bodyParser.json());
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/friendsdb';
const connection = mongoose.createConnection(mongoUri);
const Friends = require('./friends-model')(connection)
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';


app.get('/getFriends/:username', async (req, res) => {
    try{
        const username = req.params.username.toString();
        if (!username) {
            throw new Error('Username is required');
        }
        const friends = await Friends.find({username:username},{username:1, friends: 1, _id: 0});
        res.json(friends);
    }
    catch(error){
        res.status(400).json({error: error.response.data||"Error getting friends"});
    }
});
app.post('/addfriend', async (req, res) => {
    try {
        const { username: user, friend } = req.body;
        if (!user||!friend) {
            throw new Error('User and friend are required');
        }
        const response = await axios.get(`${userServiceUrl}/getUserInfo/${friend}`);
        if (!response || response.status!==200) {
            throw new Error('Friend not found');
        }
        const existingUser = await Friends.findOne({ username: user.toString() });
        if (!existingUser) {
            const newFriends = new Friends({
                username: user,
                friends: [friend]
            });
            await newFriends.save();
            res.json({ username: newFriends.username, friends: newFriends.friends });
        } else {
            existingUser.friends.push(friend);
            await existingUser.save();
            res.json({ username: existingUser.username, friends: existingUser.friends });
        }
    } catch (error) {
        res.status(400).json({ error: error.response.data||"Error adding friend" });
    }
});

const server = app.listen(port, () => {
    console.log(`Friends Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connections.forEach(connection => {
    connection.close();
    });
});

module.exports = server