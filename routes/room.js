/**
 * @swagger
 * tags:
 *   name: Room
 *   description: APIs for managing rooms
 */

/**
 * @swagger
 * /api/room/create:
 *   post:
 *     summary: Create a new room
 *     tags: [Room]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/room/{hid}:
 *   get:
 *     summary: Get rooms in a home
 *     tags: [Room]
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
 *         description: Rooms retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Home not found
 */

/**
 * @swagger
 * /api/room/edit/{rid}:
 *   put:
 *     summary: Edit an existing room
 *     tags: [Room]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room edited successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room not found
 */

/**
 * @swagger
 * /api/room/delete/{rid}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Room]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room not found
 */

const express = require("express");
const router = express.Router();
import roomController from "../app/controllers/services/roomController"
import { verifyToken, checkUserInHome } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Room
router.post("/", verifyToken, roomController.createRoom);

// [Get] Get Room
router.get("/:hid", verifyToken, checkUserInHome, roomController.getRoom);

// [Put] Edit Room
router.put("/:rid", verifyToken, roomController.editRoom);

// [Delete] Delete All Room In Home
router.delete("/deleteRoomInHome", verifyToken, roomController.deleteRoomInHome);

// [Delete] Delete Room
router.delete("/:rid", verifyToken, roomController.deleteRoom);

module.exports = router;
