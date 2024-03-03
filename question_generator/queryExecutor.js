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
}
module.exports=QueryExecutor