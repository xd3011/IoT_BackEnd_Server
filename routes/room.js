const express = require("express");
const router = express.Router();
import roomController from "../app/controllers/services/roomController"
import { verifyToken } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Room
router.post("/create", verifyToken, roomController.createRoom);

// [Get] Get Room
router.get("/:hid", verifyToken, roomController.getRoom);

// [Put] Edit Room
router.put("/edit/:rid", verifyToken, roomController.editRoom);

// [Delete] Delete Room
router.delete("/delete/:rid", verifyToken, roomController.deleteRoom);

module.exports = router;
