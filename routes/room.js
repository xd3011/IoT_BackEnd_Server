const express = require("express");
const router = express.Router();
import roomController from "../app/controllers/services/roomController"
import { verifyToken } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Home
router.post("/create", verifyToken, roomController.createRoom);

// [Get] Get Home
router.get("/:hid", verifyToken, roomController.getRoom);

// [Put] Edit Home
router.put("/edit/:rid", verifyToken, roomController.editRoom);

// [Delete] Delete Home
router.delete("/delete/:rid", verifyToken, roomController.deleteRoom);

module.exports = router;
