const tennisQuestions=require('./tennisQuestions');
const tennisQuery=tennisQuestions.getInstance();
function loadData(){
    tennisQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await tennisQuery.getPlayerWithMoreFollowers();
        return{
            "question":"Who has more followers? (Tennis)",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await tennisQuery.getPlayerForCountry();
        return{
            "question":"Which tennis player is from " + results.country + "?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await tennisQuery.getPlayerWithMoreWins();
        return{
            "question":"Who has more wins? (Tennis)",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await tennisQuery.getPlayerWithMoreLooses();
        return{
            "question":"Who has more looses? (Tennis)",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();