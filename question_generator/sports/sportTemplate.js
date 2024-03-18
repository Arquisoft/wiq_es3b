const tennisTemplates=require('./tennis/tennisTemplates');
const footballTemplates=require('./football/footballTemplates');
function loadData(){
    tennisTemplates.loadData()
    footballTemplates.loadData()
}
const templates=[
    tennisTemplates.getRandomQuestion,
    footballTemplates.getRandomQuestion
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();