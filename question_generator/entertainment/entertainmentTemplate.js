const serieTemplates=require('./series/seriesTemplates');
const movieTemplates=require('./movies/moviesTemplates');
function loadData(){
    serieTemplates.loadData()
    movieTemplates.loadData()
}
const templates=[
    serieTemplates.getRandomQuestion,
    movieTemplates.getRandomQuestion,
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();