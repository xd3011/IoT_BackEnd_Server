const mongoose = require("mongoose");

const user_name = process.env.user_name_db;
const password = process.env.password_db;
const database_name = process.env.database_name;
async function connect() {
    try {
        await mongoose.connect(
            `mongodb+srv://${user_name}:${password}@homeiot.elrfikv.mongodb.net/${database_name}?retryWrites=true&w=majority`
        );
        console.log("Connected");
    } catch (err) {
        console.log("Error connecting");
    }
}

module.exports = { connect };
