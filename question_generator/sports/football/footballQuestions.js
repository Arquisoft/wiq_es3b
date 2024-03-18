const queryExecutor=require("../../queryExecutor")
class FootballQuestions{
    #footballQuestions=null;
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
            let newResults={};
            const query=
            `
            SELECT DISTINCT ?equipo ?paisLabel ?equipoLabel ?entrenadorLabel ?followers 
            WHERE {
                ?equipo wdt:P31 wd:Q476028;  # Instancia de equipo de fútbol 
                OPTIONAL {?equipo wdt:P17 ?pais }
                OPTIONAL {?equipo wdt:P286 ?entrenador }
                OPTIONAL {?equipo wdt:P8687 ?followers }
                FILTER (BOUND(?entrenador))
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            ORDER BY DESC(?followers)
            LIMIT 250
            `
            let teams = await queryExecutor.execute(query);
            teams.forEach(team => {
                const teamId = team.equipo.value;
                const teamName = team.equipoLabel.value;
                const followers = team.followers.value;
                const country = team.paisLabel.value;
                const coach = team.entrenadorLabel.value;

                if (!newResults[teamId]) {
                    newResults[teamId] = {
                        teamId: teamId,
                        teamName: teamName,
                        followers: followers,
                        country: country,
                        coach: coach
                    };
                }
            });
            /*query = 
            `
            SELECT DISTINCT ?equipo ?estadioLabel ?equipoLabel ?followers 
            WHERE {
            ?equipo wdt:P31 wd:Q476028;  # Instancia de equipo de fútbol 
            OPTIONAL {?equipo wdt:P115 ?estadio }
            OPTIONAL {?equipo wdt:P8687 ?followers }
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            ORDER BY DESC(?followers)
            LIMIT 150
            `
            teams = await queryExecutor.execute(query);
            teams.forEach(team => {
                const teamId = team.equipo.value;
                const stadium = team.estadioLabel.value;

                if (newResults[teamId]) {
                    console.log("AAAA")
                    newResults[teamId].stadium = stadium;
                }
            }); */
            this.teams=newResults;
    }
    async getRandomTeam(numberOfTeams){
        if(Object.keys(this.teams).length==0){
            await this.loadData();
        }
        const array = Object.values(this.teams);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, numberOfTeams);
        return randomResults 
    }
    async getTeamForCountry(){
        let numberOfTeams=4;
        let result =(await this.getRandomTeam(1))[0];
        let country=result.country;
        
        let correct = result.teamName;
        let incorrects = []
        let i=1;
        while(i<numberOfTeams){
            let team=(await this.getRandomTeam(1))[0];
            if(team.country!=country){
                incorrects.push(team.teamName);
                i++;
            }
        }
        return {
            country:country,
            correct:correct,
            incorrects:incorrects
        }
    }
    async getTeamForCoach(){
        let numberOfTeams=4;
        let result =(await this.getRandomTeam(1))[0];
        let coach=result.coach;
        let teamName=result.teamName;

        let correct = result.teamName;
        let incorrects = []
        let i=1;
        while(i<numberOfTeams){
            let team=(await this.getRandomTeam(1))[0];
            if(team.teamName!=teamName){
                incorrects.push(team.teamName);
                i++;
            }
        }
        return {
            coach:coach,
            correct:correct,
            incorrects:incorrects
        }
    }
/*    async getTeamForStadium(){
        let numberOfTeams=4;
        let result =(await this.getRandomTeam(1))[0];
        let stadium=result.stadium;
        let teamName=result.teamName;

        let correct = result.teamName;
        let incorrects = []
        let i=1;
        while(i<numberOfTeams){
            let team=(await this.getRandomTeam(1))[0];
            if(team.teamName!=teamName){
                incorrects.push(team.teamName);
                i++;
            }
        }
        return {
            stadium:stadium,
            correct:correct,
            incorrects:incorrects
        }
    } */

}
module.exports = FootballQuestions;