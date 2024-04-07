const { MongoMemoryServer } = require('mongodb-memory-server');
const { default: mongoose } = require('mongoose');


let mongoserver;
let userservice;
let authservice;
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
    const User = await require('../../users/userservice/user-model')(connection);
    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    questionservice = await require("../../questionservice/question-service");
    questiongenerationservice = await require("../../question_generator/questionGenerationService");
    gameservice = await require("../../gameservice/game-service");
    // Add a user to the database
    await User.create({
      username: 'defaultuser',
      password: 'defaultpassword',
      profileImage: 'default.jpg',
    });

  }

  startServer();
