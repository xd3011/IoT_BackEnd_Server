/**
 * @swagger
 * tags:
 *   name: User
 *   description: APIs for managing users
 */

/**
 * @swagger
 * /api/user/getUserInHome/{hid}:
 *   get:
 *     summary: Get users in a home
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         description: Home ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users in home retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Home not found
 */

/**
 * @swagger
 * /api/user/addUserToHome:
 *   post:
 *     summary: Add user to a home
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               homeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added to home successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or home not found
 */

/**
 * @swagger
 * /api/user/deleteUserFromHome:
 *   delete:
 *     summary: Remove user from a home
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               homeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User removed from home successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or home not found
 */

/**
 * @swagger
 * /api/user/removeHome:
 *   delete:
 *     summary: Remove user's home
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Home removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Home not found
 */

/**
 * @swagger
 * /api/user/:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/user/deleteUser:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/createAccountAdmin:
 *   post:
 *     summary: Create an admin account
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
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
 *         description: Admin account created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/user/changeUserToAdmin:
 *   put:
 *     summary: Change a user to an admin
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User changed to admin successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

const express = require("express");
const router = express.Router();
import userController from "../app/controllers/services/userController"
import { verifyToken, checkAdmin, checkOwnerInHome, checkIsUser } from "../app/controllers/middlewares/middlewaresController";

// [Get] Get User In Home
router.get("/getUserInHome/:hid", verifyToken, userController.userInHome);

// [Post] Add User To Home
router.post("/addUserToHome", verifyToken, checkOwnerInHome, userController.addUserToHome);

// [Delete] Delete User To Home
router.delete("/deleteUserFromHome", verifyToken, checkOwnerInHome, userController.deleteUserFromHome);

// [Delete] Remove Home
router.delete("/removeHome", verifyToken, checkIsUser, userController.deleteUserFromHome);

// [Get] Get All User
router.get("/", verifyToken, checkAdmin, userController.getAllUser);

// [Delete] Delete User
router.delete("/", verifyToken, checkAdmin, userController.deleteUser);

// // [Put] Edit User By Admin
// router.put("/editUser", verifyToken, checkAdmin, userController.editUser);

// [Post] Create Account Admin
router.post("/createAccountAdmin", verifyToken, checkAdmin, userController.createAdmin);

// [Put] Change User To Admin
router.put("/changeUserToAdmin", verifyToken, checkAdmin, userController.changeToAdmin);

// [Put] Change Role To User
router.put("/changeRoleToUser", verifyToken, checkAdmin, userController.changeToUser);

// [Get] Get User Profile
router.get("/getUserProfile", verifyToken, userController.getUserProfile)

// [PUT] Update User Profile
router.put("/updateUserProfile", verifyToken, userController.updateUserProfile)

module.exports = router;
