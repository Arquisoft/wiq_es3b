const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const questionGenerationServiceUrl = process.env.QUESTION_GENERATION_SERVICE_URL || 'http://localhost:8003';
const questionServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8005';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get('/api/questions/create', async (req, res) => {
  try {
    let apiUrl=questionGenerationServiceUrl+'/api/questions/create';
    if(Object.keys(req.query).length > 0) {
      apiUrl+='?'+new URLSearchParams(req.query);
    }
    // Forward the add user request to the user service
    const userResponse = await axios.get(apiUrl);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Ruta para agregar una nueva pregunta
app.post('/addquestion', async (req, res) => {
  try {
    // Forward the add question request to the questions service
    const questionResponse = await axios.post(questionServiceUrl + '/addquestion', req.body);
    res.json(questionResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Ruta para agregar una nuevo game
app.post('/addgame', async (req, res) => {
  try {
    // Forward the add game request to the games service
    const gameResponse = await axios.post(gameServiceUrl + '/addgame', req.body);
    res.json(gameResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/getParticipation/:username', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const participationResponse = await axios.post(gameServiceUrl+'/getParticipation/:username', req.body);
    res.json(participationResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
