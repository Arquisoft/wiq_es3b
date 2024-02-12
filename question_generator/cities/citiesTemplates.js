const cities=require('./citiesQuestions');
const citiesTemplates=new cities()
const templates=[
    async ()=>
    {
        const results= await citiesTemplates.getMostPopulatedCity();
        return{
            "question":"Which city has more population?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }


]
module.exports = () => templates[Math.floor(Math.random()*templates.length)]() //se obtiene una pregunta aleatoria de los templates