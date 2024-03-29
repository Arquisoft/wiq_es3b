const footballQuestions=require('./footballQuestions');
const console = require('console')
const footballQuery=footballQuestions.getInstance();
function loadData(){
    footballQuery.loadData();
}
const templates=[
    /*async ()=>
    {
        const results = await footballQuery.doQuestion('country', 4);
        console.log("country");
        return{
            "question":"Which football team is from?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },*/
    async ()=>
    {
        const results = await footballQuery.doQuestion('coach', 4);
        console.log("coach");
        return{
            "question":"Which team trains? ",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await footballQuery.doQuestion('stadium', 4);
        console.log("stadium");
        return{
            "question":"Which team plays in? ",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();