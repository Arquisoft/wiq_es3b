const tennisTemplates=require('./tennis/tennisTemplates');
function loadData(){
    tennisTemplates.loadData()
//    footballTemplates.loadData()
}
const templates=[
    tennisTemplates.getRandomQuestion//,
//    footballTemplates.getRandomQuestion
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();