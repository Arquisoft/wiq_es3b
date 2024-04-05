const instance=require('./autonomousCommunitiesSpainQuestions');
const Query=instance.getInstance();
function loadData(){
    Query.loadData();
}
const templates=[
    async ()=>
    {
        const results= await Query.doQuestion('population',4);
        return{
            "question":"Which autonomous community of Spain has a population of?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results= await Query.doQuestion('capital',4);
        return{
            "question":"Which autonomous community of Spain has a capital called?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results= await Query.doQuestion('head_of_government',4);
        return{
            "question":"Which autonomous community of Spain has a president called?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results= await Query.doQuestion('highest_point',4);
        return{
            "question":"Which autonomous community of Spain has x as the highest point?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = () =>loadData();