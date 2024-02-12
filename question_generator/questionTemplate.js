const planetsTemplates=require('./planets/planetsTemplates');
const citiesTemplates=require('./cities/citiesTemplates')
function loadData(){
    citiesTemplates.loadData()
    planetsTemplates.loadData()
}
const templates=[
    planetsTemplates.getRandomQuestion,
    citiesTemplates.getRandomQuestion

]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();