const express = require("express");
const router = express.Router();
import homeController from "../app/controllers/services/homeController"
import { verifyToken } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Home
router.post("/create", verifyToken, homeController.createHome);

// [Get] Get Home
router.get("/", verifyToken, homeController.getHome);

// [Put] Edit Home
router.put("/edit/:hid", verifyToken, homeController.editHome);

// [Delete] Delete Home
router.delete("/delete/:hid", verifyToken, homeController.deleteHome);

module.exports = router;
