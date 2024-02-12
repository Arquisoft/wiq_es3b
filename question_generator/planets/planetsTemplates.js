const planetsQuestions=require('./planetsQuestions');
const planetsQuery=planetsQuestions.getInstance();
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
module.exports = () => templates[Math.floor(Math.random()*templates.length)]() //se obtiene una pregunta aleatoria de los templates