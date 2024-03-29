const queryExecutor=require("../../queryExecutor");
const QuestionsUtils = require("../../questions-utils");
class CAQuestions{
    static getInstance(){
        if (!this.questions) {
            this.questions = new CAQuestions();
          }
          return this.questions;
    }
    constructor(){
        this.data={};
    }
    async loadValues(){
        let result={};
        const queries=[
            `
            SELECT ?community ?communityLabel
            WHERE {
                ?community wdt:P31 wd:Q10742;
                SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
            }
            `

        ];
        for(let i = 0; i <queries.length; i++) {
            let query = queries[i];
            let cas = await queryExecutor.execute(query);
            cas.forEach(ca=>{
                const caId = ca.community.value.match(/Q\d+/)[0];
                const caName = ca.communityLabel.value;
                if (!result[caId]) {
                    result[caId] = {
                        caId: caId,
                        name: caName,
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
                name:'capital',
                id: 'P36'
            },
            {
                name:'highest_point',
                id: 'P610'
            },
            {
                name:'population',
                id: 'P1082'
            },
            {
                name: 'area',
                id: 'P2046'
            },
            {
                name: 'head_of_government',
                id: 'P6'
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
module.exports=CAQuestions;