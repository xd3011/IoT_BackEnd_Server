const express = require("express");
const router = express.Router();
import homeController from "../app/controllers/services/homeController"

// [Post] Create Home
router.post("/create", homeController.createHome);

// [Get] Get Home
router.get("/", homeController.getHome);

// [Put] Edit Home
router.put("/edit/:hid", homeController.editHome);

// [Delete] Delete Home
router.delete("/delete/:hid", homeController.deleteHome);

module.exports = router;
