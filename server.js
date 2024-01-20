const express = require("express");
const app = express();
const dotenv = require("dotenv");
import { route } from "./routes/index"

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

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/auth/login`));