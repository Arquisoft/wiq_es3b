const tennisTemplates=require('./tennis/tennisTemplates');
const footballTemplates=require('./football/footballTemplates');
const f1Templates=require('./formula1/f1Templates');
function loadData(){
    tennisTemplates.loadData()
    footballTemplates.loadData()
    f1Templates.loadData()
}
const templates=[
    tennisTemplates.getRandomQuestion,
    footballTemplates.getRandomQuestion,
    f1Templates.getRandomQuestion
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();