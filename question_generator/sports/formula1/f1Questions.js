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
            SELECT ?piloto ?pilotoLabel ?points
            WHERE {
                ?piloto wdt:P106 wd:Q10841764;
                OPTIONAL{?piloto wdt:P1358 ?points}
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                FILTER(BOUND(?points))
                }
            ORDER BY DESC (?points)
            LIMIT 150
            `
        ];
        for(let i = 0; i <queries.length; i++) {
            let query = queries[i];
            let pilots = await queryExecutor.execute(query);
            pilots.forEach(pilot=>{
                const pilotId = pilot.piloto.value.match(/Q\d+/)[0];
                const pilotName = pilot.pilotoLabel.value;
                const points = pilot.points.value;
                if (!result[pilotId]) {
                    result[pilotId] = {
                        pilotId: pilotId,
                        name: pilotName,
                        followers: points,
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
                name:'birthPlace',
                id: 'P19'
            },
            {
                name:'wins',
                id: 'P1355'
            },
            {
                name:'podiums',
                id: 'P10648'
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

}
module.exports = FootballQuestions;