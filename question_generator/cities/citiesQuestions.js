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
        this.cities={};
    }
    async loadData(){
        if (Object.keys(this.cities).length === 0) {//Se obtienen 100 ciudades relevantes
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
            let cities = await queryExecutor.execute(query);
            cities.forEach(city => {
                const cityId = city.city.value;
                const cityName = city.cityLabel.value;
                const population = city.population.value;
                const country = city.countryLabel.value;
                const elevationAboveSeaLevel = city.elevation_above_sea_level.value;

                if (!this.cities[cityId]) {
                    this.cities[cityId] = {
                        cityId: cityId,
                        cityName: cityName,
                        population: population,
                        country: country,
                        elevation_above_sea_level: []
                    };
                }

                this.cities[cityId].elevation_above_sea_level.push(parseFloat(elevationAboveSeaLevel));
            });

        }
    }
    async getRandomCities(numberOfCities){
        await this.loadData();
        const citiesArray = Object.values(this.cities);
        const randomResults = citiesArray.sort(() => Math.random() - 0.5).slice(0, numberOfCities);
        return randomResults
    }
    async getMostPopulatedCity(){
        let numberOfCities=4
        const results=await this.getRandomCities(numberOfCities);
        const formattedResults = await results.map(result => {
            return {
              item: result.cityName,
              value:parseFloat(result.population),
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
        let result =(await this.getRandomCities(1))[0];
        let country=result.country;

        let correct = result.cityName;
        let incorrects = []
        let i=1;
        while(i<numberOfCities){
            let city=(await this.getRandomCities(1))[0];
            if(city.country!=country){
                incorrects.push(city.cityName);
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
        //Using first value in the array for elevation_above_sea_level
        const formattedResults = await result.sort((a, b) => b.elevation_above_sea_level[0] - a.elevation_above_sea_level[0]);
        const finalResults={
            correct: null,
            incorrects: []
        }
        for(let i=0;i<numberOfCities;i++){
            if(i==0){
                finalResults.correct=formattedResults[i].cityName
            }
            else{
                finalResults.incorrects.push(formattedResults[i].cityName)
            }
        }
        return finalResults;
    }
}
module.exports=CitiesQuestions;