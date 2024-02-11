// user-service.js
const express = require('express');
const bodyParser = require('body-parser');

const planetTemplate=require('./planets/planetsTemplates');

const app = express();
const port = 8002;

app.use(bodyParser.json());

app.get('/api/questions/planets/create', async (req, res) => {
    res.status(200).json(await planetTemplate())
  });

const server = app.listen(port, () => {
console.log(`Listening at http://localhost:${port}`);
});