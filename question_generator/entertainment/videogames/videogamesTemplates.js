const videoGamesQuestions=require('./moviesQuestions');
const videoGamesQuery=videoGamesQuestions.getInstance();
function loadData(){
    videoGamesQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await videoGamesQuery.doQuestion('year', 4);
        return{
            "question":"Which videogame was released in?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await videoGamesQuery.getVideogameWithMoreUnitsSold();
        return{
            "question":"Which videogames has sold more units?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();