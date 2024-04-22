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
        try{
            const response = await axios.get(`${userServiceUrl}/getUserInfo/${username}`);
            if (!response || response.status !== 200) {
                throw new Error('User not found');
            }
        }catch(error){
            throw new Error('User not found');
        }
        const friends = await Friends.findOne({username:username},{username:1, friends: 1, _id: 0});
        
        res.json(friends);
    }
    catch(error){
        res.status(400).json({error: error.message||"Error getting friends"});
    }
});
app.post('/addfriend', async (req, res) => {
    try {
        const username=req.body.user;
        const friend=req.body.friend;
        if (!username || !friend) {
            throw new Error('User and friend are required');
        }
        if(username===friend){
            throw new Error('User and friend cannot be the same');
        }
        try{
            const response = await axios.get(`${userServiceUrl}/getUserInfo/${friend}`);
            if (!response || response.status !== 200) {
                throw new Error('User not found');
            }
        }catch(error){
            throw new Error('User not found');
        }
        const existingUser = await Friends.findOne({ username: username.toString() });
        if (!existingUser) {
            const newFriends = new Friends({
                username: username,
                friends: [friend]
            });
            await newFriends.save();
            res.json({ username: newFriends.username, friends: newFriends.friends });
        } else {
            if (existingUser.friends.includes(friend)) {
                throw new Error('Friend already exists');
            }
            existingUser.friends.push(friend);
            await existingUser.save();
            res.json({ username: existingUser.username, friends: existingUser.friends });
        }
    } catch (error) {
        res.status(400).json({ error: error.message || "Error adding friend" });
    }
});

app.delete('/deletefriend/:username/:friend', async (req, res) => {
    try {
        const username = req.params.username;
        const friend = req.params.friend;
        if (!username || !friend) {
            throw new Error('User and friend are required');
        }
        const existingUser = await Friends.findOne({ username: username.toString() });
        if (!existingUser || !existingUser.friends.includes(friend)) {
            throw new Error('Friend not found');
        }
        existingUser.friends = existingUser.friends.filter(f => f !== friend);
        await existingUser.save();
        res.json({ username: existingUser.username, friends: existingUser.friends });
    } catch (error) {
        res.status(400).json({ error: error.message || "Error deleting friend" });
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