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

/**
 * @swagger
 * /api/device/getDevice:
 *   get:
 *     summary: Get a specific device by its ID
 *     tags: [Device]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: did
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 */

/**
 * @swagger
 * /api/device/gatewayScanDevice:
 *   post:
 *     summary: Scan for devices through a gateway
 *     tags: [Device]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: Gateway Device ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scan initiated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gateway device not found
 */

/**
 * @swagger
 * /api/device/controlDevice:
 *   put:
 *     summary: Control a device
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
 *               action:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device controlled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Device not found
 */

/**
 * @swagger
 * /api/device/changeRoomDevice:
 *   put:
 *     summary: Change the room of a device
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
 *               roomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device room changed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Device not found
 */

/**
 * @swagger
 * /api/device/deleteDeviceInHome:
 *   delete:
 *     summary: Delete all devices in a home
 *     tags: [Device]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: hid
 *         required: true
 *         description: Home ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All devices in home deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Home not found
 */

/**
 * @swagger
 * /api/device/deleteDeviceInRoom:
 *   delete:
 *     summary: Delete all devices in a room
 *     tags: [Device]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rid
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All devices in room deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Room not found
 */

const express = require("express");
const router = express.Router();
import deviceController from "../app/controllers/services/deviceController"
import { verifyToken, checkOwnerDevice, deviceInHome, checkUserInHome } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Device
router.post("/", verifyToken, deviceController.createDevice);

// [Get] Get Device
router.get("/:hid", verifyToken, deviceController.getDevice);

// [Get] Get Device Detail
router.get("/detail/:did", verifyToken, deviceController.getDeviceDetail);

// [Post] Gateway Scan Device
router.post("/scan/:did", verifyToken, deviceController.gatewayScanDevice);

// [PUT] Control Device
router.put("/:did", verifyToken, deviceInHome, checkUserInHome, deviceController.controlDevice);

// [Put] Edit Device
router.put("/edit/:did", verifyToken, checkOwnerDevice, deviceController.editDevice);

// [Put] Change Owner Device
router.put("/change/:did", verifyToken, checkOwnerDevice, deviceController.changeOwnerDevice);

// [Put] Change room Device
router.put("/changeRoomDevice/:did", verifyToken, deviceController.changeRoomDevice);

// [Delete] Delete All Devices In Home
router.delete("/deleteAllInHome", verifyToken, deviceController.deleteDeviceInHome);

// [Delete] Delete All Devices In Room
router.delete("/deleteAllInRoom", verifyToken, deviceController.deleteDeviceInRoom);

// [Delete] Delete Device
router.delete("/:did", verifyToken, checkOwnerDevice, deviceController.deleteDevice);

module.exports = router;
