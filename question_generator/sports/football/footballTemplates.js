const footballQuestions=require('./footballQuestions');
const footballQuery=footballQuestions.getInstance();
function loadData(){
    footballQuery.loadData();
}
const templates=[
    /*async ()=>
    {
        const results = await footballQuery.doQuestion('country', 4);
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