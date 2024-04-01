const planetsTemplates=require('./planets/planetsTemplates');
const geographyTemplates=require('./geography/geographyTemplate')
const sportTemplates=require('./sports/sportTemplate')
const artTemplates=require('./art/artTemplate')
const entertainmentTemplates=require('./entertainment/entertainmentTemplate')
function loadData(){
    geographyTemplates.loadData()
    planetsTemplates.loadData()
    sportTemplates.loadData()
    artTemplates.loadData()
    entertainmentTemplates.loadData()
}
const templates=[
    ...Array(1).fill(planetsTemplates.getRandomQuestion),
    ...Array(4).fill(geographyTemplates.getRandomQuestion),
    ...Array(4).fill(sportTemplates.getRandomQuestion),
    ...Array(4).fill(artTemplates.getRandomQuestion),
    ...Array(4).fill(entertainmentTemplates.getRandomQuestion),
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();