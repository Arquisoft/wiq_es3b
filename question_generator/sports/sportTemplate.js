const tennisTemplates=require('./tennis/tennisTemplates');
const footballTemplates=require('./football/footballTemplates');
const f1Templates=require('./formula1/f1Templates');
const QuestionsUtils=require('../questions-utils')
const loadFunctions = [
    tennisTemplates.loadData,
    footballTemplates.loadData,
    f1Templates.loadData
];

const templates=[
    tennisTemplates.getRandomQuestion,
    footballTemplates.getRandomQuestion,
    f1Templates.getRandomQuestion
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>QuestionsUtils.loadData(loadFunctions);