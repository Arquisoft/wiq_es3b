const cities=require('./citiesQuestions');
const citiesQuery=cities.getInstance();
function loadData(){
    citiesQuery.loadData();
}
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
    },
    async ()=>
    {
        const results= await citiesQuery.getHigherCity();
        return{
            "question":"Which city is higher above sea level?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }


]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = () =>loadData();