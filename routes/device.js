const express = require("express");
const router = express.Router();
import deviceController from "../app/controllers/services/deviceController"
import { verifyToken, checkOwnerDevice } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Device
router.post("/create", verifyToken, deviceController.createDevice);

// [Get] Get Device
router.get("/:rid", verifyToken, deviceController.getDevice);

// [Put] Edit Device
router.put("/edit/:did", verifyToken, checkOwnerDevice, deviceController.editDevice);

// [Put] Change Owner Device
router.put("/change/:did", verifyToken, checkOwnerDevice, deviceController.changeOwnerDevice);

// [Delete] Delete Device
router.delete("/delete/:did", verifyToken, checkOwnerDevice, deviceController.deleteDevice);

module.exports = router;
