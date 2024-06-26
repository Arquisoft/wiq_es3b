const express = require('express');
const bodyParser = require('body-parser');
const i18n = require('i18n');

const geographyTemplate=require('./geography/geographyTemplate');
const planetTemplate=require('./planets/planetsTemplates');
const sportTemplate=require('./sports/sportTemplate');
const artTemplate=require('./art/artTemplate');
const entertainmentTemplate=require('./entertainment/entertainmentTemplate');
const generalTemplate=require('./questionTemplate');
const axios = require('axios');
const questionServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';

const app = express();
const port = 8003;

i18n.configure({
  locales: ['en', 'es', 'fr', 'it'],
  directory: './locales',
  defaultLocale: 'en',
  cookie: 'lang',
});

app.use(bodyParser.json());
app.use(i18n.init);

app.use((req, res, next) => {
  const userLocale = req.query.lang;
  const localeToSet = userLocale || i18n.getLocale();
  i18n.setLocale(localeToSet);
  next();
});

app.get('/api/questions/create', async (req, res) => {
  try {
    let category = req.query.category;
    let user = null;
    if (req.headers.authorization) {
      const response = await axios.get(`${authServiceUrl}/verify`, {
        headers: {
          Authorization: req.headers.authorization
        }
      });
      user = response.data.username;
    }
    let randomQuestionFunc;

    switch (category) {
      case 'planets':
        randomQuestionFunc = planetTemplate.getRandomQuestion;
        break;
      case 'geography':
        randomQuestionFunc = geographyTemplate.getRandomQuestion;
        break;
      case 'sports':
        randomQuestionFunc = sportTemplate.getRandomQuestion;
        break;
      case 'art':
        randomQuestionFunc = artTemplate.getRandomQuestion;
        break;
      case 'entertainment':
        randomQuestionFunc = entertainmentTemplate.getRandomQuestion;
        break;
      default:
        randomQuestionFunc = generalTemplate.getRandomQuestion;
        category = 'general';
    }
    let randomQuestion;
    while(true){
      try{
        randomQuestion = await randomQuestionFunc();
        break;
      }catch(err){
        console.log(err.message);

      }
    }
    randomQuestion.question = i18n.__(randomQuestion.question, randomQuestion.question_param);
    const saveQuestion = async (question) => {
      const url = `${questionServiceUrl}/questions`;
      try {
        await axios.post(url, question);
      } catch (error) {
        console.error(error);
      }
    };
    await saveQuestion({
      question: randomQuestion.question,
      correct: randomQuestion.correct,
      incorrects: randomQuestion.incorrects,
      user: user,
      category: category
    });

    res.status(200).json({
      question: randomQuestion.question,
      correct: randomQuestion.correct,
      incorrects: randomQuestion.incorrects
    });
  } catch (error) {
    console.error('Error en el servicio de generación de preguntas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function loadData() {
  generalTemplate.loadData();
}

loadData();

// Ejecuta loadData cada hora (60 minutos * 60 segundos * 1000 milisegundos)
setInterval(loadData, 60 * 60 * 1000);

const server = app.listen(port, () => {
  console.log(`Escuchando en http://localhost:${port}`);
});

module.exports = server;