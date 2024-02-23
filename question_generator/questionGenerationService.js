const express = require('express');
const bodyParser = require('body-parser');

const citiesTemplate=require('./cities/citiesTemplates');
const planetTemplate=require('./planets/planetsTemplates');
const generalTemplate=require('./questionTemplate')

const app = express();
const port = 8003;

app.use(bodyParser.json());


app.get('/api/questions/create', async (req, res) => {
  try {
    const randomQuestion = await generalTemplate.getRandomQuestion();
    res.status(200).json(randomQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/questions/planets/create', async (req, res) => {
  try {
    const randomQuestion = await planetTemplate.getRandomQuestion();
    res.status(200).json(randomQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/questions/cities/create', async (req, res) => {
  try {
    const randomQuestion = await citiesTemplate.getRandomQuestion();
    res.status(200).json(randomQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

generalTemplate.loadData();

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
module.exports = server;