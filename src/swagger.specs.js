import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación del proyecto",
            description: " documentación de los usos la api del proyecto Coderhouse"
        }
    },

    apis: ['./docs/**/**/*.yaml']
}


export const swaggerSpecs = swaggerJSDoc(options)

// module.exports = { swaggerJSDoc }
