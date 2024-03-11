const queryExecutor=require("../queryExecutor")
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
    async loadData(){
        let newResults={};
        const query= `
        SELECT ?planet ?planetLabel (SAMPLE(?radius) AS ?radius)
        WHERE {
        ?categ wdt:P361 wd:Q337768.
        ?planet wdt:P31 ?categ.
        OPTIONAL {
            ?planet wdt:P2120 ?radius.
        }
        FILTER EXISTS {
            ?planet wdt:P2120 ?radius.
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
        GROUP BY ?planet ?planetLabel
        `;
        const results=await queryExecutor.execute(query)
        results.forEach(planet => {
            const planetId = planet.planet.value;
            const planetName = planet.planetLabel.value;
            const radius = planet.radius.value;

            if (!newResults[planetId]) {
                newResults[planetId] = {
                    planetId: planetId,
                    planetName: planetName,
                    radius: []
                };
            }

            newResults[planetId].radius.push(parseFloat(radius));
        });
        if(this.planets.length ==0){
            this.planets= await newResults;
        }else{
            this.planets=newResults;
        }
    }
    async getRandomPlanets(number) {
        const array = Object.values(this.planets);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, number);
        return randomResults
    }
    async getBiggestPlanet(){
        const results=await this.getRandomPlanets(4);
        const formattedResults = await results.sort((a, b) => b.radius[0] - a.radius[0]);
        var finalResults={
            correct: null,
            incorrects:[]
        }
        for(let i = 0; i < Math.min(formattedResults.length,4); i++) {
            if(i==0){
                finalResults.correct=formattedResults[i].planetName;
            }
            else{
                finalResults.incorrects.push(formattedResults[i].planetName);
            }
        }
        return finalResults;
    }
}
module.exports =PlanetsQuestions;