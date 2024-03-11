const queryExecutor=require("../../queryExecutor")
class TennisQuestions{
    #tennisQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new TennisQuestions();
          }
          return this.questions;
    }
    constructor(){
        this.players={}
    }
    async loadData(){
        if (Object.keys(this.players).length === 0) {//Se obtienen 100 ciudades relevantes
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
                LIMIT 500
            `
            let equipos = await queryExecutor.execute(query);
            equipos.forEach(equipo => {
                const equipoId = equipo.futbolista.value;
                const equipoName = equipo.equipoLabel.value;
                const country = equipo.paisLabel.value;
                const followers = equipo.followers.value;
                const entrenador = equipo.entrenadorLabel.value;
                const estadio = equipo.estadioLabel.value;

                if (!this.players[playerId]) {
                    this.players[playerId] = {
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
    async getRandomPlayers(numberOfPlayers){
        await this.loadData();
        const array = Object.values(this.players);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, numberOfPlayers);
        return randomResults
    }
    async getPlayerWithMoreFollowers() {
        let numberOfPlayers=4;
        let results = await this.getRandomPlayers(numberOfPlayers);
        const formattedResults = await results.map(result => {
            return {
              item: result.playerName,
              value:parseInt(result.followers),
            };
          }).sort((a, b) => b.value - a.value);
        const finalResults={
            correct: null,
            incorrects: []
        }
        for(let i=0;i<numberOfPlayers;i++){
            if(i==0){
                finalResults.correct=formattedResults[i].item
            }
            else{
                finalResults.incorrects.push(formattedResults[i].item)
            }
        }
        return finalResults
    }
    async getPlayerForCountry(){
        let numberOfPlayers=4;
        let result =(await this.getRandomPlayers(1))[0];
        let country=result.country;
        
        let correct = result.playerName;
        let incorrects = []
        let i=1;
        while(i<numberOfPlayers){
            let player=(await this.getRandomPlayers(1))[0];
            if(player.country!=country){
                incorrects.push(player.playerName);
                i++;
            }
        }
        return {
            country:country,
            correct:correct,
            incorrects:incorrects
        }
    }
    async getPlayerWithMoreWins() {
        let numberOfPlayers=4;
        let results = await this.getRandomPlayers(numberOfPlayers);
        const formattedResults = await results.map(result => {
            return {
              item: result.playerName,
              value:parseInt(result.wins),
            };
          }).sort((a, b) => b.value - a.value);
        const finalResults={
            correct: null,
            incorrects: []
        }
        for(let i=0;i<numberOfPlayers;i++){
            if(i==0){
                finalResults.correct=formattedResults[i].item
            }
            else{
                finalResults.incorrects.push(formattedResults[i].item)
            }
        }
        return finalResults
    }
    async getPlayerWithMoreLooses() {
        let numberOfPlayers=4;
        let results = await this.getRandomPlayers(numberOfPlayers);
        const formattedResults = await results.map(result => {
            return {
              item: result.playerName,
              value:parseInt(result.looses),
            };
          }).sort((a, b) => b.value - a.value);
        const finalResults={
            correct: null,
            incorrects: []
        }
        for(let i=0;i<numberOfPlayers;i++){
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
module.exports = TennisQuestions;