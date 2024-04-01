const queryExecutor=require("../../queryExecutor")
const QuestionsUtils = require("../../questions-utils");
class VideogamesQuestions{
    #videogamesQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new VideogamesQuestions();
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
            SELECT DISTINCT ?videogame ?videogameLabel ?unitsSold
            WHERE {
                ?videogame wdt:P31 wd:Q7889. 
                ?videogame wdt:P2664 ?unitsSold .
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            ORDER BY DESC(?unitsSold)
            LIMIT 150
            `
        ];
        for(let i = 0; i < queries.length; i++) {
            let query = queries[i];
            let videogames = await queryExecutor.execute(query);
            videogames.forEach(videogame=>{
                const videogameId = videogame.videogame.value.match(/Q\d+/)[0];
                const videogameName = videogame.videogameLabel.value;
                const unitsSold = videogame.unitsSold.value;
                if (!result[videogameId]) {
                    result[videogameId] = {
                        videogameId: videogameId,
                        name: videogameName,
                        unitsSold: unitsSold,
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
                name:'date',
                id: 'P577'
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
    async getRandomVideogame(numberOfVideogames){
        if(Object.keys(this.data).length==0){
            await this.loadData();
        }
        const array = Object.values(this.data);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, numberOfVideogames);
        return randomResults
    }
    async getVideogameWithMoreUnitsSold() {
        let numberOfVideogames=4;
        let results = await this.getRandomVideogame(numberOfVideogames);
        const formattedResults = await results.map(result => {
            return {
              item: result.name,
              value:parseInt(result.unitsSold),
            };
          }).sort((a, b) => b.value - a.value);
        const finalResults={
            correct: null,
            incorrects: []
        }
        for(let i=0;i<numberOfVideogames;i++){
            if(i==0){
                finalResults.correct=formattedResults[i].item
            }
            else{
                finalResults.incorrects.push(formattedResults[i].item)
            }
        }
        return finalResults
    }

}
module.exports = VideogamesQuestions;