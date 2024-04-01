const serieTemplates=require('./series/seriesTemplates');
const movieTemplates=require('./movies/moviesTemplates');
const videogamesTemplates=require('./videogames/videogamesTemplates');
function loadData(){
    serieTemplates.loadData()
    movieTemplates.loadData()
    videogamesTemplates.loadData()
}
const templates=[
    serieTemplates.getRandomQuestion,
    movieTemplates.getRandomQuestion,
    videogamesTemplates.getRandomQuestion,
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();