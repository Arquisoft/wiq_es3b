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
        const results= await citiesQuery.doQuestion('country',4);
        return{
            "question":"Which city is in?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results= await citiesQuery.doQuestion('elevation_above_sea_level',4);
        return{
            "question":"Which city is higher above sea level?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async () => {
        const results = await citiesQuery.doQuestion('area', 4);
        return {
            "question": "Which city has a larger area?",
            "correct": results.correct,
            "incorrects": results.incorrects
        }
    }

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = () =>loadData();