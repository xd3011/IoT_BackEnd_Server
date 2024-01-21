const express = require("express");
const router = express.Router();
import authController from "../app/controllers/services/authController"

// [Post] Register Account
router.post("/register", authController.register);

// [Post] Confirm Account
router.get("/confirmAccount/:uid", authController.confirmAccount);

// [Post] Login
router.post("/login", authController.login);

// [Post] Refresh Token
router.post("/refreshToken/:uid", authController.refreshToken);

// [Post] Logout
router.post("/logout/:uid", authController.logout);

// [Put] Edit Password
router.put("/editPassword/:uid", authController.editPassword);

// [Post] Forgot Password
router.post("/forgotPassword", authController.forgotPassword);

// [Post] Confirm Forgot Password
router.post("/confirmForgotPassword/:uid", authController.confirmForgotPassword);

router.get("/", (req, res) => {
    res.json("auth controller");
});

module.exports = router;
