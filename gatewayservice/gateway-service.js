const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const swaggerUi = require('swagger-ui-express');
const fs=require("fs");
const YAML=require("yaml");
const os = require('os');
const promClient = require('prom-client');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const questionGenerationServiceUrl = process.env.QUESTION_GENERATION_SERVICE_URL || 'http://localhost:8003';
const questionServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8005';
const friendServiceUrl = process.env.FRIENDS_SERVICE_URL || 'http://localhost:8006';

app.use(cors());
app.use(express.json());

// Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// System metrics
const cpuUsageGauge = new promClient.Gauge({
  name: 'system_cpu_usage',
  help: 'CPU usage',
});

const memoryUsageGauge = new promClient.Gauge({
  name: 'system_memory_usage',
  help: 'Memory usage',
});

if (process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    const cpuUsage = os.loadavg()[0] / os.cpus().length;
    cpuUsageGauge.set(cpuUsage);

    const memoryUsage = (os.totalmem() - os.freemem()) / os.totalmem();
    memoryUsageGauge.set(memoryUsage);
  }, 5000);
}

// Endpoint para exponer las métricas del sistema
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});

app.delete('/deletefriend/:username/:friend', async (req, res, next) => {
  if (req.headers.authorization) {
    try{
      const response = await axios.get(`${authServiceUrl}/verify`, {
        headers: {
          Authorization: req.headers.authorization
        }
      });
      if(response.status===200){
        req.body.user = response.data.username;
        next();
      }
    }catch(error){
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
// Security middleware
app.post(['/addgame','/addfriend'], async (req, res, next) => {
  if (req.headers.authorization) {
    try{
      const response = await axios.get(`${authServiceUrl}/verify`, {
        headers: {
          Authorization: req.headers.authorization
        }
      });
      if(response.status===200){
        req.body.user = response.data.username;
        req.body.userId = response.data._id;
        next();
      }
    }catch(error){
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    try{
      const authResponse = await axios.post(authServiceUrl+'/login', req.body);
      res.json(authResponse.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Service down' });
  }
});
app.get('/verify', async (req, res) => {
  try {
    if (req.headers.authorization) {
      try{
        const authResponse = await axios.get(authServiceUrl+'/verify', {
          headers: {
            Authorization: req.headers.authorization
          }
        });
        res.json(authResponse.data);
      } catch (error) {
        res.status(error.response.status).json(error.response.data);
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Service down' });
  }
});


app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    try{
      const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
      res.json(userResponse.data);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Service down' });
  }
});

app.get('/api/questions/create', async (req, res) => {
  try {
    const queryParams = new URLSearchParams(req.query);
    const apiUrl = new URL('/api/questions/create', questionGenerationServiceUrl);
    apiUrl.search = queryParams.toString();
    
    try{
      // Forward the add user request to the user service
      const userResponse = await axios.get(apiUrl.toString(), {
        headers: {
          Authorization: req.headers.authorization
        }
      });
      res.json(userResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});

app.get('/api/info/questions', async function (req, res) {
  try {
    let url = questionServiceUrl + '/api/info/questions';
    if(Object.keys(req.query).length > 0) {
      url += '?' + new URLSearchParams(req.query).toString();
    }
    try{
      const infoResponse = await axios.get(url);
      res.json(infoResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});
app.get('/api/info/users', async (req, res) => {
  try {
    const username=req.query.user;
    let url = gameServiceUrl + '/api/info/users';
    if(username){
      url += '?user=' + username;
    }
    try{
      const infoResponse = await axios.get(url);
      res.json(infoResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});
app.get('/api/info/games', async (req, res) => {
  try {
    const username=req.query.user;
    let url = gameServiceUrl + '/api/info/games';
    if(username){
      url += '?user=' + username;
    }
    try{
      const infoResponse = await axios.get(url);
      res.json(infoResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});

// Ruta para agregar una nuevo amigo
app.post('/addgame', async (req, res) => {
  try {
    try{
      // Forward the add game request to the games service
      const gameResponse = await axios.post(gameServiceUrl + '/addgame', req.body);
      res.json(gameResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});

// Ruta para agregar una nuevo game
app.post('/addfriend', async (req, res) => {
  try {
    try{
      // Forward the add game request to the games service
      const friendsResponse = await axios.post(friendServiceUrl + '/addfriend', req.body);
      res.json(friendsResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});
app.delete('/deletefriend/:username/:friend', async (req, res) => {
  try {
    try{
      if(req.body.user!==req.params.username){
        throw new Error('Unauthorized');
      }
      const friendsResponse = await axios.delete(friendServiceUrl + '/deletefriend/'+req.body.user+'/'+req.params.friend);
      res.json(friendsResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});
app.get('/getFriends/:username', async (req, res) => {
  try {
    try{
      const friendsResponse = await axios.get(friendServiceUrl + '/getFriends/'+req.params.username);
      res.json(friendsResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});

/// Ruta para obtener la participación del usuario
app.get('/getParticipation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const apiUrl = `${gameServiceUrl}/getParticipation/${userId}`;
    try{
      const gameResponse = await axios.get(apiUrl);
      res.json(gameResponse.data);
    }catch(error){
      res.status(error.response.status).json(error.response.data);
    }
  } catch (error) {
    res.status(500).json({ error: "Service down" });
  }
});

let openapiPath='./openapi.yml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');
  const swaggerDocument = YAML.parse(file);
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server