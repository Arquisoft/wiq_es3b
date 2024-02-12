const cities=require('./citiesQuestions');
const citiesQuery=cities.getInstance();
const templates=[
    async ()=>
    {
        const results= await citiesQuery.getMostPopulatedCity();
        return{
            "question":"Which city has more population?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results= await citiesQuery.getCityForCountry();
        return{
            "question":"Which city is in "+results.country+"?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }


]
module.exports = () => templates[Math.floor(Math.random()*templates.length)]() //se obtiene una pregunta aleatoria de los templates