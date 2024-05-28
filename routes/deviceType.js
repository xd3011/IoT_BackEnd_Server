const express = require("express");
const router = express.Router();
import deviceTypeController from "../app/controllers/services/deviceTypeController";
import { verifyToken, checkAdmin } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Device Type
router.post("/", verifyToken, checkAdmin, deviceTypeController.createDeviceType);

// [Get] Get Device Type
router.get("/", verifyToken, deviceTypeController.getDeviceType);

// [Put] Edit Device Type
router.put("/:dtid", verifyToken, checkAdmin, deviceTypeController.editDeviceType);

// [Delete] Delete Device Type
router.delete("/:dtid", verifyToken, checkAdmin, deviceTypeController.deleteDeviceType);

module.exports = router;