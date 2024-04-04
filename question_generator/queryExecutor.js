const axios = require('axios');
class QueryExecutor{
    static async execute(query) {
        try {
        const wikidataEndpoint = 'https://query.wikidata.org/sparql';
    
        // Configuración de la solicitud HTTP
        const config = {
            headers: {
            'User-Agent': 'QueryExecutor/1.0 (uo287687@uniovi.es)',
            'Accept': 'application/json',
            },
        };
    
        const response = await axios.get(wikidataEndpoint, {
            params: {
            query: query,
            format: 'json',
            },
            ...config,
        });
        if (!response || !response.data) {
            console.error('La consulta a Wikidata no devolvió ningún resultado');
            return;
          }
        await new Promise(resolve => setTimeout(resolve, 200));
        return response.data.results.bindings;
    
        
    
        } catch (error) {
            console.log(query)
            console.error('Error al realizar la consulta a Wikidata:', error.message);
        }
    }
    static async executeQueryForEntityAndProperty(entity, properties){
        if(!Array.isArray(properties) || properties.length==0){
            return [];
        }
        const query=
        `SELECT ${properties.map(property=>`?${property.name}Label`).join(' ')} WHERE {${properties.map(property=>`OPTIONAL {wd:${entity} wdt:${property.id} ?${property.name}.}`).join(' ')} SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }}LIMIT 1`
        let results=await this.execute(query);
        if(results.length==0){
            return [];
        }
        const editedResults = results.map(result => {
            const editedResult = {};
            for (const key in result) {
                const newKey = key.replace(/Label$/, '');
                editedResult[newKey] = result[key];
            }
            return editedResult;
        });
        return editedResults;
    }
}
module.exports=QueryExecutor