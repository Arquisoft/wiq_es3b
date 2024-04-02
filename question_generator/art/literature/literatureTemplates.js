const moment = require('moment');
const literatureQuestions=require('./literatureQuestions');
const literatureQuery=literatureQuestions.getInstance();
function loadData(){
    literatureQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await literatureQuery.getSongByPerformers();
        return{
            "question":"Which song is song by?",
            "question_param":results.performers,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await literatureQuery.doQuestion('year', 4);
        return{
            "question":"Which song was released in?",
            "question_param":moment(results.question_param).format('YYYY-MM-DD'),
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await literatureQuery.doQuestion('album', 4);
        return{
            "question":"Which song belongs to?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();