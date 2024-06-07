import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Home IoT Server",
            version: "0.0.1",
            description: "API Swagger Document",
        },
        servers: [
            {
                url: "http://localhost:5000",
            }
        ],
    },
    apis: ["./routes/*.js"],
}

export const initSwagger = (app) => {
    const specs = swaggerJsDoc(options);

    app.use(
        "/api-docs",
        swaggerUI.serve,
        swaggerUI.setup(specs, { explorer: true })
    );
};