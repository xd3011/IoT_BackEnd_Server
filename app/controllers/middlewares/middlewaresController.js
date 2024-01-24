const jwt = require("jsonwebtoken");
import Home from "../../models/Home";
import Device from "../../models/Device";

const verifyToken = (req, res, next) => {
    const token = req.headers.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

const checkAdmin = (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Permission denied. User is not an admin" });
    }
};

const checkIsUser = (req, res, next) => {
    if (req.user.uid === req.body.uid) {
        next();
    } else {
        return res.status(403).json({ message: "Permission denied. User mismatch" });
    }
};

const checkOwnerInHome = async (req, res, next) => {
    try {
        const home = await Home.findById(req.body.hid);
        if (!home) {
            return res.status(404).json({ message: "Home not found" });
        }
        if (home.home_owner === req.user.uid) {
            next();
        } else {
            return res.status(403).json({ message: "Permission denied. User is not the owner of the home" });
        }
    } catch (error) {
        console.error("Error checking owner in home:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const checkOwnerDevice = async (req, res, next) => {
    try {
        const deviceId = req.body.did;
        if (!deviceId) {
            return res.status(400).json({ message: "Invalid device ID" });
        }
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        if (device.device_owner === req.user.uid) {
            return next();
        }
        return res.status(403).json({ message: "Permission denied. User is not the owner of the device" });
    } catch (error) {
        console.error("Error checking owner in home:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { verifyToken, checkAdmin, checkIsUser, checkOwnerInHome, checkOwnerDevice };
