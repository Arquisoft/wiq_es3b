const basketQuestions=require('./basketQuestions');
const basketQuery=basketQuestions.getInstance();
function loadData(){
    basketQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await basketQuery.getCoachByTeam();
        return{
            "question":"Which is the coach of?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await basketQuery.getHomeVenueByTeam();
        return{
            "question":"Which is the homeVenue of?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await basketQuery.doQuestion('headCoach', 4);
        return{
            "question":"Which basketball team is trained by?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await basketQuery.doQuestion('homeVenue', 4);
        return{
            "question": "Which basketball team plays in?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();