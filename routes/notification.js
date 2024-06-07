const express = require("express");
const router = express.Router();
import notificationController from "../app/controllers/services/notificationController";
import { verifyToken } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Home
router.post("/", verifyToken, notificationController.createNotification);

// [Get] Get Home
router.get("/:uid", verifyToken, notificationController.getNotification);

// [Put] Edit Home
router.put("/:nid", verifyToken, notificationController.editNotification);

// [Delete] Delete Home
router.delete("/:nid", verifyToken, notificationController.deleteNotification);

module.exports = router;