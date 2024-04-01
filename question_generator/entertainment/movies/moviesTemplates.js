const moviesQuestions=require('./moviesQuestions');
const moviesQuery=moviesQuestions.getInstance();
function loadData(){
    moviesQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await moviesQuery.doQuestion('director', 4);
        return{
            "question":"Which movie was directed by?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await moviesQuery.doQuestion('year', 4);
        return{
            "question":"Which movie was realeased in?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();