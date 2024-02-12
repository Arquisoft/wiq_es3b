const queryExecutor=require("../queryExecutor")
class PlanetsQuestions{
    #planetsQuestions=null;
    static getInstance(){
        if (!this.planetsQuestions) {
            this.planetsQuestions = new PlanetsQuestions();
          }
          return this.planetsQuestions;
    }
    async getBiggestPlanet(){
        //Se obtiene el id del planeta, su nombre y su radio
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
        //Escoge cuatro planetas aleatorios
        const randomResults = results.sort(() => Math.random() - 0.5).slice(0,4);
        const formattedResults = await randomResults.map(result => {
            return {
              item: result.planetLabel.value,
              value:parseFloat(result.radius.value),
            };
          }).sort((a, b) => b.value - a.value);
        var finalResults={
            correct: null,
            incorrects:[]
        }
        for(let i = 0; i < Math.min(formattedResults.length,4); i++) {
            if(i==0){
                finalResults.correct=formattedResults[i].item;
            }
            else{
                finalResults.incorrects.push(formattedResults[i].item);
            }
        }
        return finalResults;
    }
}
module.exports =PlanetsQuestions;