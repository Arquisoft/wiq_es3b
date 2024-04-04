const planetsTemplates=require('./planets/planetsTemplates');
const geographyTemplates=require('./geography/geographyTemplate')
const sportTemplates=require('./sports/sportTemplate')
const artTemplates=require('./art/artTemplate')
const entertainmentTemplates=require('./entertainment/entertainmentTemplate')
function loadData() {
    const loadFunctions = [
        geographyTemplates.loadData,
        planetsTemplates.loadData,
        sportTemplates.loadData,
        artTemplates.loadData,
        entertainmentTemplates.loadData
    ];

    // Función recursiva para ejecutar cada función con un retraso
    function loadDataWithDelayHelper(index) {
        if (index < loadFunctions.length) {
            // Ejecutar la función actual
            loadFunctions[index]();

            // Llamar a la próxima función después de un tiempo de espera (en milisegundos)
            setTimeout(() => {
                loadDataWithDelayHelper(index + 1);
            }, 1000); // Esperar 1 segundo entre cada llamada
        }
    }

    // Comenzar la llamada recursiva con el primer índice
    loadDataWithDelayHelper(0);
}
const templates=[
    ...Array(1).fill(planetsTemplates.getRandomQuestion),
    ...Array(4).fill(geographyTemplates.getRandomQuestion),
    ...Array(4).fill(sportTemplates.getRandomQuestion),
    ...Array(4).fill(artTemplates.getRandomQuestion),
    ...Array(4).fill(entertainmentTemplates.getRandomQuestion),
]
module.exports.getRandomQuestion = () => templates[Math.floor(Math.random()*templates.length)]();
module.exports.loadData = ()=>loadData();
