const planetsTemplates=require('./planets/planetsTemplates');
const geographyTemplates=require('./geography/geographyTemplate')
const sportTemplates=require('./sports/sportTemplate')
const artTemplates=require('./art/artTemplate')
function loadData(){
    geographyTemplates.loadData()
    planetsTemplates.loadData()
    sportTemplates.loadData()
    artTemplates.loadData()
}
const templates=[
    ...Array(1).fill(planetsTemplates.getRandomQuestion),
    ...Array(4).fill(geographyTemplates.getRandomQuestion),
    ...Array(4).fill(sportTemplates.getRandomQuestion),
    ...Array(4).fill(artTemplates.getRandomQuestion),

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();