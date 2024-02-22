const { MongoMemoryServer } = require('mongodb-memory-server');


let mongoserver;
let userservice;
let authservice;
let gatewayservice;
let questionservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    questionservice = await require("../../questionservice/question-service");
  }

  startServer();
