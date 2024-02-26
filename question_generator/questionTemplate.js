const planetsTemplates=require('./planets/planetsTemplates');
const citiesTemplates=require('./cities/citiesTemplates')
const sportTemplates=require('./sports/sportTemplate')
function loadData(){
    citiesTemplates.loadData()
    planetsTemplates.loadData()
    sportTemplates.loadData()
}
const templates=[
    planetsTemplates.getRandomQuestion,
    citiesTemplates.getRandomQuestion,
    sportTemplates.getRandomQuestion

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();