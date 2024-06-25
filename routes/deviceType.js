/**
 * @swagger
 * tags:
 *   name: DeviceType
 *   description: Device type management
 */

/**
 * @swagger
 * /deviceType/:
 *   post:
 *     summary: Create a new device type
 *     tags: [DeviceType]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device type created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /deviceType/:
 *   get:
 *     summary: Get all device types
 *     tags: [DeviceType]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Device types retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /deviceType/{dtid}:
 *   put:
 *     summary: Edit a device type
 *     tags: [DeviceType]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dtid
 *         required: true
 *         description: Device Type ID
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device type updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Device type not found
 */

/**
 * @swagger
 * /deviceType/{dtid}:
 *   delete:
 *     summary: Delete a device type
 *     tags: [DeviceType]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dtid
 *         required: true
 *         description: Device Type ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device type deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Device type not found
 */

const express = require("express");
const router = express.Router();
import deviceTypeController from "../app/controllers/services/deviceTypeController";
import { verifyToken, checkAdmin } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Device Type
router.post("/", verifyToken, checkAdmin, deviceTypeController.createDeviceType);

// [Get] Get Device Type
router.get("/", verifyToken, deviceTypeController.getDeviceType);

// [Put] Edit Device Type
router.put("/:dtid", verifyToken, checkAdmin, deviceTypeController.editDeviceType);

// [Delete] Delete Device Type
router.delete("/:dtid", verifyToken, checkAdmin, deviceTypeController.deleteDeviceType);

module.exports = router;