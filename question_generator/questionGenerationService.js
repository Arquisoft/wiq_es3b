const express = require('express');
const bodyParser = require('body-parser');
const i18n = require('i18n');

const geographyTemplate=require('./geography/geographyTemplate');
const planetTemplate=require('./planets/planetsTemplates');
const sportTemplate=require('./sports/sportTemplate');
const generalTemplate=require('./questionTemplate');
const axios = require('axios');
const questionServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';

const app = express();
const port = 8003;

i18n.configure({
  locales: ['en', 'es'],
  directory: './locales',
  defaultLocale: 'en',
  cookie: 'lang',
});

app.use(bodyParser.json());
app.use(i18n.init);

//i18n middleware
app.use(
  (req, res, next) => {
    const userLocale = req.query.lang;
    const localeToSet = userLocale || i18n.getLocale();
    i18n.setLocale(localeToSet);
    next();
  }
)


app.get('/api/questions/create', async (req, res) => {
  try {
    const category = req.query.category;
    let randomQuestion;

    switch (category) {
      case 'planets':
        randomQuestion = await planetTemplate.getRandomQuestion();
        break;
      case 'geography':
        randomQuestion = await geographyTemplate.getRandomQuestion();
        break;
      case 'sports':
        randomQuestion = await sportTemplate.getRandomQuestion();
        break;
      default:
        randomQuestion = await generalTemplate.getRandomQuestion();
    }
    randomQuestion.question = i18n.__(randomQuestion.question, randomQuestion.question_param);
    const saveQuestion = async (question) => {
      const url = questionServiceUrl+'/addquestion';
      try {
        const response = await axios.post(url, question);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    //esto creo que puede ser asincrono
    await saveQuestion({
      question: randomQuestion.question,
      correct: randomQuestion.correct,
      incorrects: randomQuestion.incorrects
    });


    res.status(200).json(
      {
        question: randomQuestion.question,
        correct: randomQuestion.correct,
        incorrects: randomQuestion.incorrects
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


function loadData() {
  generalTemplate.loadData();
}

// Ejecuta loadData cada hora (60 minutos * 60 segundos * 1000 milisegundos)
setInterval(loadData, 60 * 60 * 1000);

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
module.exports = server;