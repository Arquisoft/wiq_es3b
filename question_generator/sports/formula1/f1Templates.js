const f1Questions=require('./f1Questions');
const f1Query=f1Questions.getInstance();
function loadData(){
    f1Query.loadData();
}
const templates=[
    async ()=>
    {
        const results = await f1Query.getDriverWithMoreWins();
        return{
            "question":"Which f1 driver has more wins?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await f1Query.getDriverWithMorePodiums();
        return{
            "question":"Which f1 driver has more podiums?",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await f1Query.doQuestion('birthPlace', 4);
        return{
            "question":"Which f1 driver was born in?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await f1Query.getDriverByWins();
        return{
            "question":"Which f1 driver has wins?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();