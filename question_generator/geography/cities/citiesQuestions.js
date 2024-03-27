const queryExecutor=require("../../queryExecutor");
const QuestionsUtils = require("../../questions-utils");
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
    async loadCities(){
        let result={};
        const citiesQueries=[
            //Instancia de CITY
            `SELECT ?city ?cityLabel ?population ?countryLabel 
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
                    }
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }
            ORDER BY DESC(?population)
            LIMIT 100`,
            //Ciudades de España
            `SELECT ?city ?cityLabel ?population ?countryLabel 
            WITH{
                SELECT ?city ?cityLabel
                WHERE{
                    ?city wdt:P31 wd:Q2074737
                }
                LIMIT 1000
                } AS %i
                WHERE {
                    INCLUDE %i
                    OPTIONAL{
                    ?city wdt:P1082 ?population.
                    ?city wdt:P17 ?country.
                    }
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }
            ORDER BY DESC(?population)
            LIMIT 20`,
            //Metropolis
            `SELECT ?city ?cityLabel ?population ?countryLabel 
            WITH{
                SELECT ?city ?cityLabel
                WHERE{
                    ?city wdt:P31 wd:Q200250
                }
                LIMIT 1000
                } AS %i
                WHERE {
                    INCLUDE %i
                    OPTIONAL{
                    ?city wdt:P1082 ?population.
                    ?city wdt:P17 ?country.
                    }
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }
            ORDER BY DESC(?population)
            LIMIT 5`

        ];
        for(let i = 0; i <citiesQueries.length; i++) {
            let query = citiesQueries[i];
            let cities = await queryExecutor.execute(query);
            cities.forEach(city=>{
                const cityId = city.city.value.match(/Q\d+/)[0];
                const cityName = city.cityLabel.value;
                const population = city.population.value;
                const country = city.countryLabel.value;
                if (!result[cityId]) {
                    result[cityId] = {
                        cityId: cityId,
                        name: cityName,
                        population: population,
                        country: country
                    }
                }
            });
        }
        return result;
    
    }
    async loadData(){
        let newResults = await this.loadCities();
        const propertiesToLoad=[
            {
                name:'elevation_above_sea_level',
                id: 'P2044'
            },
            {
                name:'highest_point',
                id: 'P610'
            },
            {
                name: 'area',
                id: 'P2046'
            },
            {
                name: 'continent',
                id: 'P30'
            },
            {
                name: 'head_of_government',
                id: 'P6'
            },
            {
                name: 'located_in_time_zone',
                id: 'P421'
            }
        ]
        for(let i = 0; i <Object.keys(newResults).length; i++) {
            let cityId = Object.keys(newResults)[i];
            let  r= await queryExecutor.executeQueryForEntityAndProperty(cityId, propertiesToLoad);
            if(r.length>0){
                for(let j=0;j<propertiesToLoad.length;j++){
                    if(r[0][propertiesToLoad[j].name]!==undefined){
                        newResults[cityId][propertiesToLoad[j].name] = r[0][propertiesToLoad[j].name].value;
                    }
                }
            }
        }
        this.cities=newResults;
        
    }
    async getRandomCities(numberOfCities){
        if(Object.keys(this.cities).length==0){
            await this.loadData();
        }
        const citiesArray = Object.values(this.cities);
        const randomResults = citiesArray.sort(() => Math.random() - 0.5).slice(0, numberOfCities);
        return randomResults
    }
    async getMostPopulatedCity(){
        let numberOfCities=4
        const results=await this.getRandomCities(numberOfCities);
        const formattedResults = await results.map(result => {
            return {
              item: result.name,
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

    async doQuestion(property,nValues){
        if(Object.keys(this.cities).length==0){
            await this.loadData();
        }
        return QuestionsUtils.getValuesFromDataAndProperty(this.cities, property, nValues);
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
                finalResults.correct=formattedResults[i].name
            }
            else{
                finalResults.incorrects.push(formattedResults[i].name)
            }
        }
        return finalResults;
    }
}
module.exports=CitiesQuestions;