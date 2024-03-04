const tennisQuestions=require('./tennisQuestions');
const tennisQuery=tennisQuestions.getInstance();
function loadData(){
    tennisQuery.loadData();
}
const templates=[
    async ()=>
    {
        const result= await tennisQuery.getPlayerWithMoreGrandSlams();
        return{
            "question":"Who has more Grand Slams?",
            "correct":result.correct,
            "incorrects":result.incorrects
        }
    }


]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();