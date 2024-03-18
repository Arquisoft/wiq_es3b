const footballQuestions=require('./footballQuestions');
const footballQuery=footballQuestions.getInstance();
function loadData(){
    footballQuery.loadData();
}
const templates=[
    async ()=>
    {
        const results = await footballQuery.getTeamForCountry();
        return{
            "question":"Which football team is from " + results.country + "? ",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    },
    async ()=>
    {
        const results = await footballQuery.getTeamForCoach();
        return{
            "question":"Which team trains " + results.coach + "? ",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }/*,
    async ()=>
    {
        const results = await footballQuery.getTeamForCoach();
        return{
            "question":"Which team plays in " + results.stadium + "? ",
            "correct":results.correct,
            "incorrects":results.incorrects
        }
    }*/
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();