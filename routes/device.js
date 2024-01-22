const express = require("express");
const router = express.Router();
import deviceController from "../app/controllers/services/deviceController"

// [Post] Create Home
router.post("/create", deviceController.createDevice);

// [Get] Get Home
router.get("/:hid", deviceController.getDevice);

// [Put] Edit Home
router.put("/edit/:rid", deviceController.editDevice);

// [Delete] Delete Home
router.delete("/delete/:rid", deviceController.deleteDevice);

module.exports = router;
