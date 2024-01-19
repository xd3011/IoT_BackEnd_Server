const express = require("express");
const app = express();
const dotenv = require("dotenv");
import { router } from "./routes/index"

// Config .env
dotenv.config();
const PORT = process.env.PORT || 5000;

// Create router
// const route = require("./routes");
// const db = require("./config/db");

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

router(app);

// route(app);

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/auth/login`));