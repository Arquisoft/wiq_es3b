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
    
        return response.data.results.bindings;
    
        
    
        } catch (error) {
        console.error('Error al realizar la consulta a Wikidata:', error.message);
        }
    }
    static async executeQueryForEntityAndProperty(entity, properties){
        if(!Array.isArray(properties) || properties.length==0){
            return [];
        }
        const query=
        `SELECT ${properties.map(property=>`?${property.name}`).join(' ')} WHERE {?id ?prop wd:${entity};wdt:${properties[0].id} ?${properties[0].name}. OPTIONAL {${properties.map(property=>`?id wdt:${property.id} ?${property.name}.`).join(' ')} SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }}}LIMIT 1`
        return await this.execute(query);
    }
}
module.exports=QueryExecutor