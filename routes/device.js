const express = require("express");
const router = express.Router();
import deviceController from "../app/controllers/services/deviceController"
import { verifyToken } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Home
router.post("/create", verifyToken, deviceController.createDevice);

// [Get] Get Home
router.get("/:hid", verifyToken, deviceController.getDevice);

// [Put] Edit Home
router.put("/edit/:rid", verifyToken, deviceController.editDevice);

// [Delete] Delete Home
router.delete("/delete/:rid", verifyToken, deviceController.deleteDevice);

module.exports = router;
