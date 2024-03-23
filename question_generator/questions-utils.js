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
            if(result.correct==null && value[property]!=undefined){
                result.propertyResult=value[property];
                result.correct=value.name;
                break;
            }
            else if ((!(result.incorrects.includes(value.name)||result.propertyResult==value[property]))&& value[property]!=undefined) {
                result.incorrects.push(value.name);
                break;
            }
        }
    }
}

module.exports=QuestionsUtils;