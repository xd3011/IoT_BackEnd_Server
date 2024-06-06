/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: APIs for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully registered
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/auth/confirmAccount/{uid}:
 *   get:
 *     summary: Confirm account registration
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID obtained from registration confirmation link
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account confirmed successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/refreshToken/{uid}:
 *   post:
 *     summary: Refresh user's access token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/logout/{uid}:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/editPassword/{uid}:
 *   put:
 *     summary: Edit user's password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: Request to reset user's password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset request sent successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/confirmForgotPassword/{uid}:
 *   post:
 *     summary: Confirm password reset request
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID obtained from password reset confirmation link
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       404:
 *         description: User not found
 */

const express = require("express");
const router = express.Router();
import authController from "../app/controllers/services/authController"
import { verifyToken, checkIsUser } from "../app/controllers/middlewares/middlewaresController";

// [Post] Register Account
router.post("/register", authController.register);

// [Get] Confirm Account
router.get("/confirmAccount/:uid", authController.confirmAccount);

// [Post] Login
router.post("/login", authController.login);

// [Post] Set Token Notification
router.post("/setTokenNotification", verifyToken, authController.setTokenNotification);

// [Post] Remove Token Notification
router.post("/removeTokenNotification", authController.removeTokenNotification);

// [Post] Refresh Token
router.post("/refreshToken/:uid", authController.refreshToken);

// [Post] Logout
router.post("/logout/:uid", authController.logout);

// [Put] Edit Password
router.put("/editPassword", verifyToken, checkIsUser, authController.editPassword);

// [Post] Forgot Password
router.post("/forgotPassword", authController.forgotPassword);

// [Post] Confirm Forgot Password
router.post("/verifyOTP", authController.confirmForgotPassword);

// [Post] Reset Password
router.post("/resetPassword", verifyToken, authController.resetPassword);

module.exports = router;
