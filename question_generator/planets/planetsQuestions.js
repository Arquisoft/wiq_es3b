const queryExecutor=require("../queryExecutor")
const QuestionsUtils = require("../questions-utils");
class PlanetsQuestions{
    #planetsQuestions=null;
    static getInstance(){
        if (!this.planetsQuestions) {
            this.planetsQuestions = new PlanetsQuestions();
          }
          return this.planetsQuestions;
    }
    constructor(){
        this.planets={}
    }
    async loadPlanets(){
        let result={};
        const planetsQueries=[
            `
            SELECT ?planet ?planetLabel
            WHERE {
                ?categ wdt:P361 wd:Q337768.
                ?planet wdt:P31 ?categ.
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            `,
            `
            SELECT ?planet ?planetLabel
            WHERE {
                ?planet wdt:P31 wd:Q3504248;
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            `

        ];
        for(let i = 0; i <planetsQueries.length; i++) {
            let query = planetsQueries[i];
            let planets = await queryExecutor.execute(query);
            planets.forEach(planet=>{
                const planetId = planet.planet.value.match(/Q\d+/)[0];
                const planetName = planet.planetLabel.value;
                if (!result[planetId]) {
                    result[planetId] = {
                        planetId: planetId,
                        name: planetName
                    }
                }
            });
        }
        return result;

    }
    async loadData(){
        let newResults = await this.loadPlanets();
        const propertiesToLoad=[
            {
                name:'radius',
                id: 'P2120'
            },
            {
                name:'density',
                id: 'P2054'
            },
            {
                name:'area',
                id: 'P2046'
            },
            {
                name:'mass',
                id: 'P2067'
            },
            {
                name:'orbital_period',
                id: 'P2047'
            },
            {
                name:'highest_point',
                id: 'P610'
            },
            {
                name:'lowest_point',
                id: 'P1589'
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
        this.planets=newResults;
    }
    async getRandomPlanets(number) {
        if(Object.keys(this.planets).length==0){
            await this.loadData();
        }
        const array = Object.values(this.planets);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, number);
        return randomResults
    }
    async doQuestion(property,nValues){
        if(Object.keys(this.planets).length==0){
            await this.loadData();
        }
        return QuestionsUtils.getValuesFromDataAndProperty(this.planets, property, nValues);
    }
    async getBiggestPlanet(){
        const results=await this.getRandomPlanets(4);
        let formattedResults = results.filter(planet => planet.radius !== undefined);
        formattedResults = await formattedResults.sort((a, b) => parseFloat(b.radius) - parseFloat(a.radius));
        let finalResults={
            correct: null,
            incorrects:[]
        }
        for(let i = 0; i < Math.min(formattedResults.length,4); i++) {
            if(i==0){
                finalResults.correct=formattedResults[i].name;
            }
            else{
                finalResults.incorrects.push(formattedResults[i].name);
            }
        }
        return finalResults;
    }
}
module.exports =PlanetsQuestions;