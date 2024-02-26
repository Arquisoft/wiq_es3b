const express = require('express');
const bodyParser = require('body-parser');
const i18n = require('i18n');

const geographyTemplate=require('./geography/geographyTemplate');
const planetTemplate=require('./planets/planetsTemplates');
const sportTemplate=require('./sports/sportTemplate');
const generalTemplate=require('./questionTemplate');

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


generalTemplate.loadData();

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
module.exports = server;