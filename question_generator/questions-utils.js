const console = require('console')
class QuestionsUtils{
    static getValuesFromDataAndProperty(data, property, nValues){
        const result = {
            correct: null,
            incorrects: [],
            propertyResult:null
        };
        const dataArray = Object.values(data);
        for (let i=0; i<nValues; i++){
            this.getValidValueFromDataAndProperty(dataArray, property, result);
        }
        return {
            question_param: result.propertyResult,
            correct: result.correct,
            incorrects: result.incorrects
        }
    }
    static getValidValueFromDataAndProperty(dataArray, property, result){
        const random = dataArray.sort(() => Math.random() - 0.5);
        for (let i = 0; i < random.length; i++) {
            const value = random[i];
            if(result.correct==null && value[property]!=undefined && !/^Q\d+/.test(value[property])
                && value[property].trim() !== ""){
                result.propertyResult=value[property];
                result.correct=value.name;
                break;
            }
            else if ((!(result.incorrects.includes(value.name)||result.propertyResult==value[property]))&& value[property]!=undefined
            && !/^Q\d+/.test(value.name) && value.name.trim() !== "") {
                result.incorrects.push(value.name);
                break;
            }
        }
    }
    static async loadData(loadFunctions) {
    
        // Función recursiva para ejecutar cada función con un retraso
        async function loadDataWithDelayHelper(index) {
            if (index < loadFunctions.length) {
                // Ejecutar la función actual
                loadFunctions[index]();
    
                // Llamar a la próxima función después de un tiempo de espera (en milisegundos)
                setTimeout(async () => {
                    loadDataWithDelayHelper(index + 1);
                }, 5000); // Espera entre llamadas
            }
        }
    
        // Comenzar la llamada recursiva con el primer índice
        loadDataWithDelayHelper(0);
    }
}

module.exports=QuestionsUtils;