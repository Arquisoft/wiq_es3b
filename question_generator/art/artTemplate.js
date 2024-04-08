const musicTemplates=require('./music/musicTemplates');
const paintTemplates=require('./paints/paintsTemplates');
const literatureTemplates=require('./literature/literatureTemplates');
const QuestionsUtils=require('../questions-utils')
const loadFunctions=[
    musicTemplates.loadData,
    paintTemplates.loadData,
    literatureTemplates.loadData
]
const templates=[
    musicTemplates.getRandomQuestion,
    paintTemplates.getRandomQuestion,
    literatureTemplates.getRandomQuestion,
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>QuestionsUtils.loadData(loadFunctions);