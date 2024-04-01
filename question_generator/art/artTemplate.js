const musicTemplates=require('./music/musicTemplates');
//const paintTemplates=require('./paint/paintTemplates');
function loadData(){
    musicTemplates.loadData()
    //paintTemplates.loadData()
}
const templates=[
    musicTemplates.getRandomQuestion//,
    //paintTemplates.getRandomQuestion,
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();