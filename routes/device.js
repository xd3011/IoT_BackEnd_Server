/**
 * @swagger
 * tags:
 *   name: Device
 *   description: APIs for managing devices
 */

/**
 * @swagger
 * /api/device/create:
 *   post:
 *     summary: Create a new device
 *     tags: [Device]
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
 *         description: Device created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/device/{rid}:
 *   get:
 *     summary: Get devices in a room
 *     tags: [Device]
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
 *         description: Devices retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room not found
 */

/**
 * @swagger
 * /api/device/edit/{did}:
 *   put:
 *     summary: Edit an existing device
 *     tags: [Device]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: Device ID
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
 *         description: Device edited successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Device not found
 */

/**
 * @swagger
 * /api/device/change/{did}:
 *   put:
 *     summary: Change owner of a device
 *     tags: [Device]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newOwnerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Owner of the device changed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Device not found
 */

/**
 * @swagger
 * /api/device/delete/{did}:
 *   delete:
 *     summary: Delete a device
 *     tags: [Device]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Device not found
 */

const express = require("express");
const router = express.Router();
import deviceController from "../app/controllers/services/deviceController"
import { verifyToken, checkOwnerDevice } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Device
router.post("/create", verifyToken, deviceController.createDevice);

// [Get] Get Device
router.get("/:rid", verifyToken, deviceController.getDevice);

// [Put] Edit Device
router.put("/edit/:did", verifyToken, checkOwnerDevice, deviceController.editDevice);

// [Put] Change Owner Device
router.put("/change/:did", verifyToken, checkOwnerDevice, deviceController.changeOwnerDevice);

// [Delete] Delete All Devices In Room
router.delete("/deleteAllInRoom", verifyToken, checkOwnerDevice, deviceController.deleteDeviceInRoom);

// [Delete] Delete Device
router.delete("/:did", verifyToken, checkOwnerDevice, deviceController.deleteDevice);


module.exports = router;
