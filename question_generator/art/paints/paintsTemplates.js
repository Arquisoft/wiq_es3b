const moment = require('moment');
const paintQuestions=require('./paintsQuestions');
const paintQuery=paintQuestions.getInstance();
function loadData(){
    paintQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await paintQuery.doQuestion('year', 4);
        return{
            "question":"Which paint was painted in?",
            "question_param":moment(results.question_param).format('YYYY-MM-DD'),
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await paintQuery.doQuestion('genre', 4);
        return{
            "question":"Which paint belongs to genre?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();