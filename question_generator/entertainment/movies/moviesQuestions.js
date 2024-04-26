const queryExecutor=require("../../queryExecutor")
const QuestionsUtils = require("../../questions-utils");
class MoviesQuestions{
    #moviesQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new MoviesQuestions();
          }
          return this.questions;
    }
    constructor(){
        this.data={}
    }
    async loadValues(){
        let result={};
        const queries=[
            `
            SELECT DISTINCT ?movie ?movieLabel ?attendance
            WHERE {
                ?movie wdt:P31 wd:Q11424. 
                ?movie wdt:P2142 ?attendance .
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            ORDER BY DESC(?attendance)
            LIMIT 30
            `
        ];
        for(let i = 0; i < queries.length; i++) {
            let query = queries[i];
            let movies = await queryExecutor.execute(query);
            movies.forEach(movie=>{
                const movieId = movie.movie.value.match(/Q\d+/)[0];
                const movieName = movie.movieLabel.value;
                const attendance = movie.attendance.value;
                if (!result[movieId]) {
                    result[movieId] = {
                        movieId: movieId,
                        name: movieName,
                        attendance: attendance,
                    }
                }
            });
        }
        return result;
    
    }

    async loadData(){
        let newResults = await this.loadValues();
        const propertiesToLoad=[
            {
                name:'year',
                id: 'P577'
            }, 
            {
                name: 'director',
                id: 'P57'
            }
        ]
        for(let i = 0; i <Object.keys(newResults).length; i++) {
            let id = Object.keys(newResults)[i];
            let  r= await queryExecutor.executeQueryForEntityAndProperty(id, propertiesToLoad);
            if(r.length>0){
                for(let j=0;j<propertiesToLoad.length;j++){
                    if(r[0][propertiesToLoad[j].name]!==undefined){
                        newResults[id][propertiesToLoad[j].name] = r[0][propertiesToLoad[j].name].value;
                    }
                }
            }
        }
        this.data=newResults;
    }
    async doQuestion(property,nValues){
        if(Object.keys(this.data).length==0){
            await this.loadData();
        }
        return QuestionsUtils.getValuesFromDataAndProperty(this.data, property, nValues);
    }
    async getRandomMovie(numberOfMovies){
        if(Object.keys(this.data).length==0){
            await this.loadData();
        }
        const array = Object.values(this.data);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, numberOfMovies);
        return randomResults
    }

}
module.exports = MoviesQuestions;