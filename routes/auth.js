const express = require("express");
const router = express.Router();
import authController from "../app/controllers/services/authController"
import { verifyToken, checkAdmin, checkIsUser, checkOwnerInHome } from "../app/controllers/middlewares/middlewaresController";

// [Post] Register Account
router.post("/register", authController.register);

// [Get] Confirm Account
router.get("/confirmAccount/:uid", authController.confirmAccount);

// [Post] Login
router.post("/login", authController.login);

// [Post] Refresh Token
router.post("/refreshToken/:uid", authController.refreshToken);

// [Post] Logout
router.post("/logout/:uid", authController.logout);

// [Put] Edit Password
router.put("/editPassword/:uid", verifyToken, checkIsUser, authController.editPassword);

// [Post] Forgot Password
router.post("/forgotPassword", authController.forgotPassword);

// [Post] Confirm Forgot Password
router.post("/confirmForgotPassword/:uid", authController.confirmForgotPassword);

router.get("/", (req, res) => {
    res.json("auth controller");
});

module.exports = router;
