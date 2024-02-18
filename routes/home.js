/**
 * @swagger
 * tags:
 *   name: Home
 *   description: APIs for managing homes
 */

/**
 * @swagger
 * /api/home/create:
 *   post:
 *     summary: Create a new home
 *     tags: [Home]
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
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Home created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/home/:
 *   get:
 *     summary: Get list of homes
 *     tags: [Home]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of homes retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/home/edit/{hid}:
 *   put:
 *     summary: Edit an existing home
 *     tags: [Home]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         description: Home ID
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
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Home edited successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Home not found
 */

/**
 * @swagger
 * /api/home/delete/{hid}:
 *   delete:
 *     summary: Delete a home
 *     tags: [Home]
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
 *         description: Home deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Home not found
 */

const express = require("express");
const router = express.Router();
import homeController from "../app/controllers/services/homeController"
import { verifyToken, checkOwnerInHome } from "../app/controllers/middlewares/middlewaresController";

// [Post] Create Home
router.post("/", verifyToken, homeController.createHome);

// [Get] Get Home
router.get("/", verifyToken, homeController.getHome);

// [Put] Edit Home
router.put("/:hid", verifyToken, checkOwnerInHome, homeController.editHome);

// [Delete] Delete Home
router.delete("/:hid", verifyToken, checkOwnerInHome, homeController.deleteHome);

module.exports = router;
