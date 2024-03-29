const citiesTemplate=require('./cities/citiesTemplates')
const autonomousCommunitiesSpainTemplate=require('./autonomous_communities_spain/autonomousCommunitiesSpainTemplates')
function loadData(){
    citiesTemplate.loadData();
    autonomousCommunitiesSpainTemplate.loadData();
}
const templates=[
    citiesTemplate.getRandomQuestion,
    autonomousCommunitiesSpainTemplate.getRandomQuestion
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = () =>loadData();