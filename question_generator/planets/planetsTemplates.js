const planetsQuestions=require('./planetsQuestions');
const planetsQuery=planetsQuestions.getInstance();
function loadData(){
    planetsQuery.loadData();
}
const templates=[
    async ()=>
    {
        const planets= await planetsQuery.getBiggestPlanet();
        return{
            "question":"Which planet is bigger?",
            "correct":planets.correct,
            "incorrects":planets.incorrects
        }
    },
    async ()=>
    {
        const result= await planetsQuery.doQuestion('radius',4);
        return{
            "question":"Which planet has a radius of?",
            "question_param":result.question_param,
            "correct":result.correct,
            "incorrects":result.incorrects
        }
    }


]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();