const citiesTemplate=require('./cities/citiesTemplates')
function loadData(){
    citiesTemplate.loadData();
}
const templates=[
    citiesTemplate.getRandomQuestion
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = () =>loadData();