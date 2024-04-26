const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');



let mongoserver;
let userservice;
let authservice;
let friendsservice;
let gatewayservice;
let questionservice;
let questiongenerationservice;
let gameservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    const connection = await mongoose.createConnection(mongoUri);
    const User = await require('./user-model')(connection);

    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    friendsservice = await require("../../users/friendsservice/friends-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    questionservice = await require("../../questionservice/question-service");
    questiongenerationservice = await require("../../question_generator/questionGenerationService");
    gameservice = await require("../../gameservice/game-service");
    const hashedPassword = await bcrypt.hash('defaultpassword', 10);
    const user = new User({
      username: 'defaultuser',
      password: hashedPassword,
      profileImage: 'default.jpg',
    });
    await user.save();
  }

  startServer();
