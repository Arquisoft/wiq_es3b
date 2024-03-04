const tennisTemplates=require('./tennis/tennisTemplates');
function loadData(){
    tennisTemplates.loadData()
}
const templates=[
    tennisTemplates.getRandomQuestion

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();