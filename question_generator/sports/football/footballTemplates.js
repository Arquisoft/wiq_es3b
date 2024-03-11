const footballQuestions=require('./footballQuestions');
const footballQuery=footballQuestions.getInstance();
function loadData(){
    footballQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await footballQuery.getPlayerWithMoreGrandSlams();
        return{
            "question":"Who has more followers? (Tennis)",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();