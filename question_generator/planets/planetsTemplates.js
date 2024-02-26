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
    }


]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();