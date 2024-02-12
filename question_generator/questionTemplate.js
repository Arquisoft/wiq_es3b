const planetsTemplates=require('./planets/planetsTemplates');
const citiesTemplates=require('./cities/citiesTemplates')
const templates=[
    planetsTemplates,
    citiesTemplates

]
module.exports = () => templates[Math.floor(Math.random()*templates.length)]() //se obtiene una pregunta aleatoria de los templates