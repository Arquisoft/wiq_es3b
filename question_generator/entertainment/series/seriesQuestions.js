require('console');
const queryExecutor=require("../../queryExecutor")
const QuestionsUtils = require("../../questions-utils");
class SeriesQuestions{
    #seriesQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new SeriesQuestions();
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
            SELECT DISTINCT ?serie ?serieLabel ?followers
            WHERE {
                ?serie wdt:P31 wd:Q5398426. 
                ?serie wdt:P8687 ?followers .
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            ORDER BY DESC(?followers)
            LIMIT 30
            `
        ];
        for(let i = 0; i <queries.length; i++) {
            let query = queries[i];
            let series = await queryExecutor.execute(query);
            series.forEach(serie=>{
                const serieId = serie.serie.value.match(/Q\d+/)[0];
                const serieName = serie.serieLabel.value;
                const followers = serie.followers.value;
                if (!result[serieId]) {
                    result[serieId] = {
                        serieId: serieId,
                        name: serieName,
                        followers: followers,
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
                name:'seasons',
                id: 'P2437'
            }, 
            {
                name: 'episodes',
                id: 'P1113'
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
    async getRandomSerie(numberOfSeries){
        if(Object.keys(this.data).length==0){
            await this.loadData();
        }
        const array = Object.values(this.data);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, numberOfSeries);
        return randomResults
    }
    async getSongByPerformers() {
        let numberOfSeries=4;
        let result =(await this.getRandomSerie(1))[0];
        let performers = result.performers.join(', ');
        
        let correct = result.name;
        let incorrects = []
        let i=1;
        while(i<numberOfSeries){
            let song=(await this.getRandomSerie(1))[0];
            if(song.performers.join(', ')!=performers){
                incorrects.push(song.name);
                i++;
            }
        }
        return {
            performers:performers,
            correct:correct,
            incorrects:incorrects
        }
    }

}
module.exports = SeriesQuestions;