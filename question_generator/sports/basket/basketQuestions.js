const console = require('console')
const queryExecutor=require("../../queryExecutor")
const QuestionsUtils = require("../../questions-utils");
class BasketQuestions{
    #basketQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new BasketQuestions();
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
            SELECT ?equipo ?equipoLabel (GROUP_CONCAT(?followers; separator=", ") as ?allFollowers)
            WHERE {
            ?equipo wdt:P31 wd:Q13393265;
                    wdt:P118 wd:Q155223 .
            ?equipo wdt:P8687 ?followers
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            GROUP BY ?equipo ?equipoLabel
            `
        ];
        for(let i = 0; i <queries.length; i++) {
            let query = queries[i];
            let teams = await queryExecutor.execute(query);
            teams.forEach(team=>{
                const teamId = team.equipo.value.match(/Q\d+/)[0];
                const teamName = team.equipoLabel.value;
                if (!result[teamId]) {
                    result[teamId] = {
                        teamId: teamId,
                        name: teamName,
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
                name:'headCoach',
                id: 'P286'
            },
            {
                name:'homeVenue',
                id: 'P115'
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
    async getCoachByTeam() {
        let numberOfTeams=4;
        let result =(await this.getRandomTeam(1))[0];
        let name = result.name;
        
        let correct = result.headCoach;
        let incorrects = []
        let i=1;
        while(i<numberOfTeams){
            let team=(await this.getRandomTeam(1))[0];
            if(team.name!=name){
                incorrects.push(team.headCoach);
                i++;
            }
        }
        return {
            question_param:name,
            correct:correct,
            incorrects:incorrects
        }
    }
    async getHomeVenueByTeam() {
        let numberOfTeams=4;
        let result =(await this.getRandomTeam(1))[0];
        let name = result.name;
        
        let correct = result.homeVenue;
        let incorrects = []
        let i=1;
        while(i<numberOfTeams){
            let team=(await this.getRandomTeam(1))[0];
            if(team.name!=name){
                incorrects.push(team.headVenue);
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
module.exports = BasketQuestions;