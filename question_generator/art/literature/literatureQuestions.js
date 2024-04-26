require('console');
const queryExecutor=require("../../queryExecutor")
const QuestionsUtils = require("../../questions-utils");
class LiteratureQuestions{
    #literatureQuestions=null;
    static getInstance(){
        if (!this.questions) {
            this.questions = new LiteratureQuestions();
          }
          return this.questions;
    }
    constructor(){
        this.data={}
    }
    async loadValues(){
        let result={};
        const queries=[
            `
            SELECT DISTINCT ?libro ?libroLabel
            WHERE {
                ?libro wdt:P31 wd:Q7725634. 
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            LIMIT 150
            `
        ];
        for(let i = 0; i <queries.length; i++) {
            let query = queries[i];
            let books = await queryExecutor.execute(query);
            books.forEach(book=>{
                const bookId = book.libro.value.match(/Q\d+/)[0];
                const bookName = book.libroLabel.value;
                if (!result[bookId]) {
                    result[bookId] = {
                        bookId: bookId,
                        name: bookName,
                    }
                }
            });
        }
        return result;
    
    }

    async loadData(){
        let newResults = await this.loadValues();
        const propertiesToLoad=[
            {
                name:'language',
                id: 'P407'
            }, 
            {
                name: 'genre',
                id: 'P7937'
            },
            {
                name: 'author',
                id: 'P50'
            }
        ]
        for(let i = 0; i <Object.keys(newResults).length; i++) {
            let id = Object.keys(newResults)[i];
            let  r= await queryExecutor.executeQueryForEntityAndProperty(id, propertiesToLoad);
            if(r.length>0){
                for(let j=0;j<propertiesToLoad.length;j++){
                    if(r[0][propertiesToLoad[j].name]!==undefined){
                        newResults[id][propertiesToLoad[j].name] = r[0][propertiesToLoad[j].name].value;
                    }
                }
            }
        }
        this.data=newResults;
    }
    async doQuestion(property,nValues){
        if(Object.keys(this.data).length==0){
            await this.loadData();
        }
        return QuestionsUtils.getValuesFromDataAndProperty(this.data, property, nValues);
    }
    async getRandomBook(numberOfBooks){
        if(Object.keys(this.data).length==0){
            await this.loadData();
        }
        const array = Object.values(this.data);
        const randomResults = array.sort(() => Math.random() - 0.5).slice(0, numberOfBooks);
        return randomResults
    }
    async getAuthorOfBook() {
        let numberOfBooks=4;
        let result =(await this.getRandomBook(1))[0];
        while(result.author == undefined || result.author.trim() == "" || /^Q\d+/.test(result.author) ){
            result =(await this.getRandomBook(1))[0];
        }
        let name = result.name;
        
        let correct = result.author;
        let incorrects = []
        let i=1;
        while(i<numberOfBooks){
            let book=(await this.getRandomBook(1))[0];
            if(book.author == undefined && book.author!=correct && book.author.trim() !== "" && !/^Q\d+/.test(book.author)){
                incorrects.push(book.author);
                i++;
            }
        }
        return {
            question_param:name,
            correct:correct,
            incorrects:incorrects
        }
    }

}
module.exports = LiteratureQuestions;