const authRouter = require("./auth");
const userRouter = require("./user");
const homeRouter = require("./home");
const roomRouter = require("./room");
const deviceRouter = require("./device");
const deviceTypeRouter = require("./deviceType");
const notificationRouter = require("./notification");

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

    // Create router for Device Type
    app.use("/api/deviceType", deviceTypeRouter);

    // Create router for Notificataion
    app.use("/api/notification", notificationRouter);
}

module.exports = { route };