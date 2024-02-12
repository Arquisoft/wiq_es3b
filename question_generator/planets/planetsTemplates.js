const planetsQuestions=require('./planetsQuestions');
const templates=[
    async ()=>
    {
        const planets= await planetsQuestions.getBiggestPlanet();
        return{
            "question":"Which planet is bigger?",
            "correct":planets.correct,
            "incorrects":planets.incorrects
        }
    }


]
module.exports = () => templates[Math.floor(Math.random()*templates.length)]() //se obtiene una pregunta aleatoria de los templates