const queryExecutor=require("../../queryExecutor")
class FootballQuestions{
    #tennisQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new FootballQuestions();
          }
          return this.questions;
    }
    constructor(){
        this.teams={}
    }
    async loadData(){
        if (Object.keys(this.teams).length === 0) {//Se obtienen 100 ciudades relevantes
            const query=
            `
            SELECT DISTINCT ?equipo ?paisLabel ?equipoLabel ?entrenadorLabel ?followers ?estadioLabel
                WHERE {
                    ?equipo wdt:P31 wd:Q476028;  # Instancia de equipo de fútbol 
                    OPTIONAL {?equipo wdt:P17 ?pais }
                    OPTIONAL {?equipo wdt:P286 ?entrenador }
                    OPTIONAL {?equipo wdt:P8687 ?followers }
                    OPTIONAL {?equipo wdt:P115 ?estadio }
                    FILTER (BOUND(?entrenador))
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }
                ORDER BY DESC(?followers)
                LIMIT 250
            `
            let teams = await queryExecutor.execute(query);
            teams.forEach(tenista => {
                const playerId = tenista.tenista.value;
                const playerName = tenista.tenistaLabel.value;
                const followers = tenista.followers.value;
                const country = tenista.paisLabel.value;
                const record = tenista.victorias.value;

                const recordAux = record ? record.split("-") : ['', ''];
                const wins = recordAux[0];
                const looses = recordAux[1];

                if (!this.teams[playerId]) {
                    this.teams[playerId] = {
                        playerId: playerId,
                        playerName: playerName,
                        followers: followers,
                        country: country,
                        wins: wins,
                        looses: looses
                    };
                }
            });
        }
    }
    async getRandomPlayer(number){
        await this.loadData();
        const array = Object.values(this.data);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, number);
        return randomResults
    }
    async getPlayerWithMoreGrandSlams() {
        const results=await this.getRandomPlayer(4);
        //...
        return {
            correct: "Rafa Nadal",
            incorrects: ["Persona 2", "Persona 3"]
        }
    }

}
module.exports = FootballQuestions;