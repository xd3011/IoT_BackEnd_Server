const express = require("express");
const router = express.Router();
import notificationController from "../app/controllers/services/notificationController";

// [Post] Create Home
router.post("/", notificationController.createNotification);

// [Get] Get Home
router.get("/:uid", notificationController.getNotification);

// [Put] Edit Home
router.put("/:nid", notificationController.editNotification);

// [Delete] Delete Home
router.delete("/:nid", notificationController.deleteNotification);

module.exports = router;