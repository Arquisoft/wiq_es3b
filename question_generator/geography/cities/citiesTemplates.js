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
            "question": "Which city has an area of?",
            "question_param": results.question_param,
            "correct": results.correct,
            "incorrects": results.incorrects
        }
    },
    async () => {
        const results = await citiesQuery.doQuestion('continent', 4);
        return {
            "question": "Which city is in?",
            "question_param": results.question_param,
            "correct": results.correct,
            "incorrects": results.incorrects
        }
    },
    async () => {
        const results = await citiesQuery.doQuestion('head_of_government', 4);
        return {
            "question": "Which city is governed by?",
            "question_param": results.question_param,
            "correct": results.correct,
            "incorrects": results.incorrects
        }
    },
    async () => {
        const results = await citiesQuery.doQuestion('located_in_time_zone', 4);
        return {
            "question": "Which city is in the time zone?",
            "question_param": results.question_param,
            "correct": results.correct,
            "incorrects": results.incorrects
        }
    }

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = () =>loadData();