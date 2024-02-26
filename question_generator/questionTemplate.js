const planetsTemplates=require('./planets/planetsTemplates');
const geographyTemplates=require('./geography/geographyTemplate')
const sportTemplates=require('./sports/sportTemplate')
function loadData(){
    geographyTemplates.loadData()
    planetsTemplates.loadData()
    sportTemplates.loadData()
}
const templates=[
    planetsTemplates.getRandomQuestion,
    geographyTemplates.getRandomQuestion,
    sportTemplates.getRandomQuestion

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();