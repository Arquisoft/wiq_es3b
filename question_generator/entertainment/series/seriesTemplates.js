const seriesQuestions=require('./seriesQuestions');
const seriesQuery=seriesQuestions.getInstance();
function loadData(){
    seriesQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await seriesQuery.doQuestion('seasons', 4);
        return{
            "question":"Which serie has seasons?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await seriesQuery.doQuestion('episodes', 4);
        return{
            "question":"Which serie has episodes?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();