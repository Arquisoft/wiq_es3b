const musicTemplates=require('./music/musicTemplates');
const paintTemplates=require('./paints/paintsTemplates');
//const literatureTemplates=require('./literature/literatureTemplates');
function loadData(){
    musicTemplates.loadData()
    paintTemplates.loadData()
//    literatureTemplates.loadData()
}
const templates=[
    musicTemplates.getRandomQuestion,
    paintTemplates.getRandomQuestion,
//    literatureTemplates.getRandomQuestion,
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();