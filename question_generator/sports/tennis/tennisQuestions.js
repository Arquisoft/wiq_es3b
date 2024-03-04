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
        this.data={}
    }
    async loadData(){
        /*
        if(Object.keys(this.data).length==0){
            const query= `

        `;
        const results=await queryExecutor.execute(query)
        results.forEach(result => {
            //this.data.push();
        });
        }
        */
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
module.exports =TennisQuestions;