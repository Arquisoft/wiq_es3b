const tennisQuestions=require('./tennisQuestions');
const tennisQuery=tennisQuestions.getInstance();
function loadData(){
    tennisQuery.loadData();
}
const templates=[
    async ()=>
    {
        const result= await tennisQuery.getPlayerWithMoreFollowers();
        return{
            "question":"Who has more followers?",
            "correct":result.correct,
            "incorrects":result.incorrects
        }
    },
    async ()=>
    {
        const result= await tennisQuery.getPlayerForCountry();
        return{
            "question":"Which player is from?",
            "question_param":result.country,
            "correct":result.correct,
            "incorrects":result.incorrects
        }
    },
    async ()=>
    {
        const result= await tennisQuery.getPlayerWithMoreWins();
        return{
            "question":"Who has more wins?",
            "correct":result.correct,
            "incorrects":result.incorrects
        }
    },
    async ()=>
    {
        const result= await tennisQuery.getPlayerWithMoreLooses();
        return{
            "question":"Who has more looses?",
            "correct":result.correct,
            "incorrects":result.incorrects
        }
    }

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();