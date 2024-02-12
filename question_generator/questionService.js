const express = require('express');
const bodyParser = require('body-parser');

const citiesTemplate=require('./cities/citiesTemplates');
const planetTemplate=require('./planets/planetsTemplates');
const generalTemplate=require('./questionTemplate')

const app = express();
const port = 8002;

app.use(bodyParser.json());

app.get('/api/questions/create', async (req, res) => {
  res.status(200).json(await generalTemplate())
});
app.get('/api/questions/planets/create', async (req, res) => {
  res.status(200).json(await planetTemplate())
});
app.get('/api/questions/cities/create', async (req, res) => {
  res.status(200).json(await citiesTemplate())
});

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});