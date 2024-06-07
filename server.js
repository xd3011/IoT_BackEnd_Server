const express = require("express");
const app = express();
const dotenv = require("dotenv");
import { route } from "./routes/index"
import mqtt from "./configs/mqtt";
import { initWebSocket } from "./configs/ws";
import { initSwagger } from "./configs/swagger";
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
initWebSocket(server);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

route(app);

initSwagger(app);

server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/auth/login`));