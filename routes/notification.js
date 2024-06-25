/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Notification management
 */

/**
 * @swagger
 * /notification/:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notification/{uid}:
 *   get:
 *     summary: Get notifications by user ID
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       404:
 *         description: Notifications not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notification/{nid}:
 *   put:
 *     summary: Edit a notification
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nid
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /notification/{nid}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nid
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */

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