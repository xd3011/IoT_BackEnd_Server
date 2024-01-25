const express = require("express");
const app = express();
const dotenv = require("dotenv");
import { route } from "./routes/index"
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

// Config .env
dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect Database
const database = require("./configs/database/index");
database.connect();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

route(app);

// Config Swagger
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Home IoT",
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

const specs = swaggerJsDoc(options);

app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(specs, { explorer: true })
);

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/auth/login`));