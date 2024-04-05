const queryExecutor=require("../../queryExecutor")
const QuestionsUtils = require("../../questions-utils");
class PaintQuestions{
    #paintQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new PaintQuestions();
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
            SELECT DISTINCT ?cuadro ?cuadroLabel
            WHERE {
                ?cuadro wdt:P31 wd:Q3305213;
                        wdt:P186 wd:Q296955. 
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            LIMIT 150
            `
        ];
        for(let i = 0; i <queries.length; i++) {
            let query = queries[i];
            let paints = await queryExecutor.execute(query);
            paints.forEach(paint=>{
                const paintId = paint.cuadro.value.match(/Q\d+/)[0];
                const paintName = paint.cuadroLabel.value;
                if (!result[paintId]) {
                    result[paintId] = {
                        paintId: paintId,
                        name: paintName,
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
                id: 'P571'
            }, 
            {
                name: 'genre',
                id: 'P136'
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
module.exports = PaintQuestions;