const express = require("express");
const router = express.Router();
import roomController from "../app/controllers/services/roomController"

// [Post] Create Home
router.post("/create", roomController.createRoom);

// [Get] Get Home
router.get("/:hid", roomController.getRoom);

// [Put] Edit Home
router.put("/edit/:rid", roomController.editRoom);

// [Delete] Delete Home
router.delete("/delete/:rid", roomController.deleteRoom);

module.exports = router;
