const console = require('console')
const queryExecutor=require("../../queryExecutor")
const QuestionsUtils = require("../../questions-utils");
class FootballQuestions{
    #footballQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new FootballQuestions();
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
            SELECT DISTINCT ?equipo ?equipoLabel ?followers
            WHERE {
                ?equipo wdt:P31 wd:Q476028;  
                        wdt:P17 wd:Q29;
                OPTIONAL {?equipo wdt:P8687 ?followers }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            ORDER BY DESC(?followers)
            LIMIT 50 
            `
        ];
        for(let i = 0; i <queries.length; i++) {
            let query = queries[i];
            let teams = await queryExecutor.execute(query);
            teams.forEach(team=>{
                const teamId = team.equipo.value.match(/Q\d+/)[0];
                const teamName = team.equipoLabel.value;
                const followers = team.followers.value;
                if (!result[teamId]) {
                    result[teamId] = {
                        teamId: teamId,
                        name: teamName,
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
                name:'country',
                id: 'P17'
            },
            {
                name:'coach',
                id: 'P286'
            },
            {
                name:'stadium',
                id: 'P115'
            },
            {
                name:'inception',
                id: 'P571'
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
    async getRandomTeam(numberOfTeams){
        if(Object.keys(this.data).length==0){
            await this.loadData();
        }
        const array = Object.values(this.data);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, numberOfTeams);
        return randomResults
    }
    async getCoachOfTeam() {
        let numberOfTeams=4;
        let result =(await this.getRandomTeam(1))[0];
        let name = result.name;
        
        let correct = result.coach;
        let incorrects = []
        let i=1;
        while(i<numberOfTeams){
            let team=(await this.getRandomTeam(1))[0];
            if(team.coach!=correct && team.coach.trim() !== "" && !/^Q\d+/.test(team.coach)){
                incorrects.push(team.coach);
                i++;
            }
        }
        return {
            question_param:name,
            correct:correct,
            incorrects:incorrects
        }
    }
    async getStadiumOfTeam() {
        let numberOfTeams=4;
        let result =(await this.getRandomTeam(1))[0];
        let name = result.name;
        
        let correct = result.stadium;
        let incorrects = []
        let i=1;
        while(i<numberOfTeams){
            let team=(await this.getRandomTeam(1))[0];
            if(team.stadium!=correct && team.stadium.trim() !== "" && !/^Q\d+/.test(team.stadium)){
                incorrects.push(team.stadium);
                i++;
            }
        }
        return {
            question_param:name,
            correct:correct,
            incorrects:incorrects
        }
    }

}
module.exports = FootballQuestions;