// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 8006;

// Middleware to parse JSON in request body
app.use(bodyParser.json());
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
const connection = mongoose.createConnection(mongoUri);
const Friends = require('./friends-model')(connection)


app.get('/getFriends/:username', async (req, res) => {
    try{
        const username = req.params.username.toString();
        if (!username) {
            throw new Error('Username is required');
        }
        const friends = await Friends.find({username:username},{friends: 1});
        res.json(friends);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
});
app.post('/addfriend', async (req, res) => {
    try {
        const { username, friend } = req.body;
        if (!friend) {
            throw new Error('User and friend are required');
        }
        const existingUser = await Friends.findOne({ username: username.toString() });
        if (!existingUser) {
            const newFriends = new Friends({
                username: username,
                friends: [friend]
            });
            await newFriends.save();
            res.json(newFriends);
        } else {
            existingUser.friends.push(friend);
            await existingUser.save();
            res.json(existingUser);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
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