import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Evidencias',
            version: '1.0.0',
            description: 'Documentación Swagger de la API de Evidencias',
        },
        servers: [
            {
                url: 'http://localhost:3001/api',
            },
        ],
    },
    apis: [ './src/routes/*.ts' ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;