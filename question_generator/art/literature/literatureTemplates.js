const moment = require('moment');
const literatureQuestions=require('./literatureQuestions');
const literatureQuery=literatureQuestions.getInstance();
function loadData(){
    literatureQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await literatureQuery.getAuthorOfBook();
        return{
            "question":"Which author wrote?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }/*,
    async ()=>
    {
        const results = await literatureQuery.getLanguageOfBook();
        return{
            "question":"Which is the original language of?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }*/,
    async ()=>
    {
        const results = await literatureQuery.doQuestion('language', 4);
        return{
            "question":"Which book is written in?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await literatureQuery.doQuestion('author', 4);
        return{
            "question":"Which book was written by?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await literatureQuery.doQuestion('genre', 4);
        return{
            "question":"Which book belongs to genre?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();