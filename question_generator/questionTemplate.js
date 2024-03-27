const planetsTemplates=require('./planets/planetsTemplates');
const geographyTemplates=require('./geography/geographyTemplate')
const sportTemplates=require('./sports/sportTemplate')
function loadData(){
    geographyTemplates.loadData()
    planetsTemplates.loadData()
    sportTemplates.loadData()
}
const templates=[
    ...Array(1).fill(planetsTemplates.getRandomQuestion),
    ...Array(4).fill(geographyTemplates.getRandomQuestion),
    ...Array(4).fill(sportTemplates.getRandomQuestion)

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();