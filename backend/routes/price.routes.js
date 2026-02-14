/**
 * @swagger
 * tags:
 *   name: Prices
 *   description: Market Price Management APIs
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getPrices,
  createPrice,
  getPriceById,
  updatePrice,
  deletePrice
} = require('../controllers/price.controller');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/prices:
 *   get:
 *     summary: Get all prices
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of prices fetched successfully
 */
router.get('/', getPrices);

/**
 * @swagger
 * /api/prices:
 *   post:
 *     summary: Create a new market price entry
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - marketId
 *               - date
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 698bf98bce59f78422bc3881
 *               marketId:
 *                 type: string
 *                 example: 698be6fb0dcb6e17c14ea180
 *               minPrice:
 *                 type: number
 *                 example: 18
 *               maxPrice:
 *                 type: number
 *                 example: 26
 *               avgPrice:
 *                 type: number
 *                 example: 22
 *               unit:
 *                 type: string
 *                 example: kg
 *               date:
 *                 type: string
 *                 example: 2026-02-13
 *     responses:
 *       201:
 *         description: Price created successfully
 */
router.post('/', createPrice);

/**
 * @swagger
 * /api/prices/{id}:
 *   get:
 *     summary: Get price by ID
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Price ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price details fetched
 */
router.get('/:id', getPriceById);

/**
 * @swagger
 * /api/prices/{id}:
 *   put:
 *     summary: Update price
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Price ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minPrice:
 *                 type: number
 *                 example: 20
 *               maxPrice:
 *                 type: number
 *                 example: 28
 *               avgPrice:
 *                 type: number
 *                 example: 24
 *     responses:
 *       200:
 *         description: Price updated successfully
 */
router.put('/:id', updatePrice);

/**
 * @swagger
 * /api/prices/{id}:
 *   delete:
 *     summary: Delete price
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Price ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price deleted successfully
 */
router.delete('/:id', deletePrice);

module.exports = router;
