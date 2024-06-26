// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');


const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
const connection = mongoose.createConnection(mongoUri);
const User = require('./user-model')(connection)



// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
}

app.post('/users', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['username', 'password', 'profileImage']);
        // Check if the password has at least 4 characters
        if (req.body.password.length < 4) {
          res.status(400).json({ error: "Password must be at least 4 characters long" });
          return;
        }
        if (req.body.username.length === 0) {
          res.status(400).json({ error: "Username can't be empty" });
          return;
        }
        if (req.body.username.length > 20) {
          res.status(400).json({ error: "Username can't have more than 20 characters" });
          return;
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ username: req.body.username.toString() });
        if (existingUser) {
          res.status(400).json({ error: "User already exist" }); 
          return;
        }

        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
          profileImage: req.body.profileImage,
        });

        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
  });
  app.get('/users/:username', async (req, res) => {
    try {
      const username = req.params.username;
      try{
        const user = await User.findOne({ username:username.toString() },{ _id: 1, username: 1, createdAt: 1 });
        if (!user) {
          res.status(400).json({ error: 'User not found' });
          return;
        }
        res.json(user);
      }catch(error){
        res.status(400).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.get('/users', async (req, res) => {
    try {
      const users = await User.find({}, { _id: 1, username: 1, createdAt: 1 });
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connections.forEach(connection => {
      connection.close();
    });
  });

module.exports = server