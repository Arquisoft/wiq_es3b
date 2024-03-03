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
            const query=`
            SELECT DISTINCT ?tenista ?tenistaLabel ?paisLabel (GROUP_CONCAT(DISTINCT ?ocupacionLabel; 
                separator=", ") AS ?ocupaciones) ?victorias ?followers
                WHERE {
                    ?tenista wdt:P106 wd:Q10833314. # Tenista

                    OPTIONAL { 
                        ?tenista wdt:P1532 ?paisItem.
                        ?paisItem rdfs:label ?paisLabel.
                        FILTER(LANG(?paisLabel) = "en") 
                    }
                    OPTIONAL { ?tenista wdt:P106 ?ocupacion. } 
                    OPTIONAL { ?tenista wdt:P564 ?victorias. } # Obtener el número total de victorias
                    OPTIONAL { ?tenista wdt:P8687 ?followers. }
                    FILTER (BOUND(?victorias) && BOUND(?paisLabel) && BOUND(?followers)) # Excluir resultados donde el campo 'victorias' está vacío
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }
                GROUP BY ?tenista ?tenistaLabel ?paisLabel ?victorias ?followers
                ORDER BY DESC(?followers)
                LIMIT 350
            `
            let players = await queryExecutor.execute(query);
            players.forEach(tenista => {
                const playerId = tenista.tenista.value;
                const playerName = tenista.tenistaLabel.value;
                const followers = tenista.followers.value;
                const country = tenista.paisLabel.value;
                const record = tenista.victorias.value;

                const [wins, looses] = record ? record.split("-") : ['', ''];

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