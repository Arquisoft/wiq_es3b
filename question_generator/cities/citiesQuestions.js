const queryExecutor=require("../queryExecutor")
class CitiesQuestions{
    #citiesQuestions=null;
    static getInstance(){
        if (!this.citiesQuestions) {
            this.citiesQuestions = new CitiesQuestions();
          }
          return this.citiesQuestions;
    }
    constructor(){
        this.cities=[]
    }
    async getRandomCities(numberOfCities){
        //Hay un problema de repetición de ciudades
        if(this.cities.length==0){ //Se obtienen 100 ciudades relevantes
            const query=`
            SELECT ?city ?cityLabel ?population ?countryLabel ?elevation_above_sea_level
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
                    ?city wdt:P1082 ?population.
                    ?city wdt:P17 ?country.
                    ?city wdt:P2044 ?elevation_above_sea_level
                    }
                    FILTER EXISTS{
                        ?city wdt:P1082 ?population.
                        ?city wdt:P17 ?country.
                        ?city wdt:P2044 ?elevation_above_sea_level
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
    async getCityForCountry(){
        let numberOfCities=4;
        let result =await this.getRandomCities(1);
        let country=result[0].countryLabel.value;
        let correct = result[0].cityLabel.value;
        let incorrects = []
        let i=1;
        while(i<numberOfCities){
            let city=await this.getRandomCities(1);
            if(city[0].countryLabel.value!=country){
                incorrects.push(city[0].cityLabel.value);
                i++;
            }
        }
        return {
            country:country,
            correct:correct,
            incorrects:incorrects
        }
    }
    async getHigherCity(){
        let numberOfCities=4;
        let result =await this.getRandomCities(numberOfCities);
        const formattedResults = await result.sort((a, b) => b.elevation_above_sea_level.value - a.elevation_above_sea_level.value);
        const finalResults={
            correct: null,
            incorrects: []
        }
        for(let i=0;i<numberOfCities;i++){
            if(i==0){
                finalResults.correct=formattedResults[i].cityLabel.value
            }
            else{
                finalResults.incorrects.push(formattedResults[i].cityLabel.value)
            }
        }
        return finalResults;
    }
}
module.exports=CitiesQuestions;