const musicQuestions=require('./musicQuestions');
const musicQuery=musicQuestions.getInstance();
function loadData(){
    musicQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await musicQuery.getSongByPerformers();
        return{
            "question":"Which song is sing by?",
            "question_param":results.performers,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await musicQuery.doQuestion('year', 4);
        results.question_param = moment(results.question_param).format('YYYY-MM-DD')
        return{
            "question":"Which song was released in?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await musicQuery.doQuestion('album', 4);
        return{
            "question":"Which song belongs to?",
            "question_param":results.question_param,
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();