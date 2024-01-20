const authRouter = require("./auth");
const userRouter = require("./user");
const homeRouter = require("./home");
const roomRouter = require("./room");
const deviceRouter = require("./device");

function route(app) {

    // Create router for authentication
    app.use("/api/auth", authRouter);

    // Create router for User
    app.use("/api/user", userRouter);

    // Create router for Home
    app.use("/api/home", homeRouter);

    // Create router for Room
    app.use("/api/room", roomRouter);

    // Create router for Device
    app.use("/api/device", deviceRouter);
}

module.exports = { route };