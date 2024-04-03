require('console');
const queryExecutor=require("../../queryExecutor")
const QuestionsUtils = require("../../questions-utils");
class MusicQuestions{
    #musicQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new MusicQuestions();
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
            SELECT ?cancion ?cancionLabel ?performerLabel
            WHERE {
                ?cancion wdt:P31 wd:Q134556;
                         wdt:P407 wd:Q1321 .
                ?cancion wdt:P175 ?performer
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            LIMIT 200
            `
        ];
        for(let i = 0; i <queries.length; i++) {
            let query = queries[i];
            let songs = await queryExecutor.execute(query);
            songs.forEach(song=>{
                const songId = song.cancion.value.match(/Q\d+/)[0];
                const songName = song.cancionLabel.value;
                const performer = song.performerLabel.value;
                if (!result[songId]) {
                    result[songId] = {
                        songId: songId,
                        name: songName,
                        performers: [],
                    }
                }
                result[songId].performers.push(performer);
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
                name: 'album',
                id: 'P361'
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
    async getRandomSong(numberOfSongs){
        if(Object.keys(this.data).length==0){
            await this.loadData();
        }
        const array = Object.values(this.data);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, numberOfSongs);
        return randomResults
    }
    async getSongByPerformers() {
        let numberOfSongs=4;
        let result =(await this.getRandomSong(1))[0];
        let performers = result.performers.join(', ');
        
        let correct = result.name;
        let incorrects = []
        let i=1;
        while(i<numberOfSongs){
            let song=(await this.getRandomSong(1))[0];
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
module.exports = MusicQuestions;