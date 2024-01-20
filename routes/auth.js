const express = require("express");
const router = express.Router();
import authController from "../app/controllers/services/authController"

// [Post] Register Account
router.post("/register", authController);

// [Post] Confirm Account

// [Post] Login
router.post("/login");

// [Post] Refresh Token
router.post("/refreshToken");

// [Post] Logout
router.post("/logout");

// [Post] Edit Password
router.post("/editPassword");

// [Post] Forgot Password
router.post("/forgotPassword");

router.get("/", (req, res) => {
    res.json("auth controller");
});

module.exports = router;