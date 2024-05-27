const express = require("express");
const app = express();
const dotenv = require("dotenv");
import { route } from "./routes/index"
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import mqtt from "./configs/mqtt/index";
import { WebSocketServer } from "ws";
import url from "url";
import http from "http";

const cors = require('cors')
app.use(cors());

// Config .env
dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect Database
const database = require("./configs/database/index");
database.connect();

mqtt.mqttconnect();

// Config websocket
const server = http.createServer(app);

const connectionUser = {};
const connectionScanDevice = {};
const wsServer = new WebSocketServer({ server: server });

export const handleSend = (data) => {
    Object.keys(connectionScanDevice).forEach((uid) => {
        const { connection, macAddress } = connectionScanDevice[uid];
        if (macAddress === data.gateway) {
            connection.send(JSON.stringify(data));
        }
    });
};

const handleClose = (uid, action) => {
    return () => {
        if (action === 'scanDevice') {
            delete connectionScanDevice[uid];
        }
        else if (action === 'notification') {
            delete connectionUser[uid];
        }
    };
};

const handleMessage = (message) => {
    console.log(message);
};

wsServer.on('connection', (connection, request) => {
    const { macAddress, uid, action } = url.parse(request.url, true).query;
    if (action === "scanDevice") {
        connectionScanDevice[uid] = {
            connection,
            macAddress,
        };
    } else if (action === "notification") {
        connectionUser[uid] = connection;
    }
    connection.on('message', (message) => handleMessage(message));
    connection.on('close', () => handleClose(uid, action));
});

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

server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/auth/login`));