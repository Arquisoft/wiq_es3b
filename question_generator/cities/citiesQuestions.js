const queryExecutor=require("../QueryExecutor")
class CitiesQuestions{
    constructor(){
        this.cities=[]
    }
    async getRandomCities(numberOfCities){
        if(this.cities.length==0){ //Se obtienen 100 ciudades relevantes
            const query=`
            SELECT ?city ?cityLabel ?population
            WITH{
            SELECT ?city ?cityLabel
            WHERE{
                ?city wdt:P31 wd:Q515
            }
            LIMIT 1000
            } AS %i
            WHERE {
                INCLUDE %i
                OPTIONAL{
                ?city wdt:P1082 ?population
                }
                FILTER EXISTS{
                ?city wdt:P1082 ?population
                }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            ORDER BY DESC(?population)
            LIMIT 100
            `
            this.cities=await queryExecutor.execute(query)
        }
        const randomResults = this.cities.sort(() => Math.random() - 0.5).slice(0,numberOfCities);
        return randomResults
    }
    async getMostPopulatedCity(){
        let numberOfCities=4
        const results=await this.getRandomCities(numberOfCities);
        const formattedResults = await results.map(result => {
            return {
              item: result.cityLabel.value,
              value:parseFloat(result.population.value),
            };
          }).sort((a, b) => b.value - a.value);
        const finalResults={
            correct: null,
            incorrects: []
        }
        for(let i=0;i<numberOfCities;i++){
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
module.exports =CitiesQuestions;