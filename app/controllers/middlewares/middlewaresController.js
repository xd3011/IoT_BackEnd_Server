const jwt = require("jsonwebtoken");
import Home from "../../models/Home";
import Device from "../../models/Device";

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Access token is missing" });
    }
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

const checkAdmin = (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ error: "Permission denied. User is not an admin" });
    }
};

const checkIsUser = (req, res, next) => {
    if (req.user.uid === req.body.uid) {
        next();
    } else {
        return res.status(403).json({ error: "Permission denied. User mismatch" });
    }
};

const checkOwnerInHome = async (req, res, next) => {
    try {
        let { hid } = req.params;
        if (!hid) {
            hid = req.body.hid;
        }
        const home = await Home.findById(hid);
        if (!home) {
            return res.status(404).json({ error: "Home not found" });
        }
        if (home.home_owner == req.user.uid) {
            next();
        } else {
            return res.status(403).json({ error: "Permission denied. User is not the owner of the home" });
        }
    } catch (error) {
        console.error("Error checking owner in home:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const checkUserInHome = async (req, res, next) => {
    try {
        const { hid } = req.params;
        const home = await Home.findById(hid);
        if (!home) {
            return res.status(404).json({ error: "Home not found" });
        }
        if (home.user_in_home.includes(req.user.uid)) {
            next();
        }
        else {
            return res.status(404).json({ error: "User is not in the home" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const checkOwnerDevice = async (req, res, next) => {
    try {
        const { did } = req.params;
        if (!did) {
            return res.status(400).json({ error: "Invalid device ID" });
        }
        const device = await Device.findById(did);
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }
        if (device.device_owner.toString() === req.user.uid) {
            return next();
        }
        return res.status(403).json({ error: "Permission denied. User is not the owner of the device" });
    } catch (error) {
        console.error("Error checking owner in home:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deviceInHome = async (req, res, next) => {
    try {
        const { did } = req.params;
        if (!did) {
            return res.status(404).json({ error: "Couldn't find device" });
        }

        const device = await Device.findById(did);
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }

        const hid = device.device_in_home;
        if (!hid) {
            return res.status(404).json({ error: "Device not assigned to a room" });
        }

        req.params.hid = hid;
        next();
    } catch (error) {
        console.error("Error checking owner in home:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { verifyToken, checkAdmin, checkIsUser, checkOwnerInHome, checkUserInHome, checkOwnerDevice, deviceInHome };
