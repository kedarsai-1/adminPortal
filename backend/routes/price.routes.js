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
 *     description: >
 *       Admin users get all prices.
 *       Non-admin users get prices only for their own market.
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *       - in: query
 *         name: marketId
 *         schema:
 *           type: string
 *         description: Filter by market ID (admin only)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
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
 *     description: >
 *       Admin users must provide marketId.
 *       Non-admin users create prices only for their own market.
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
 *               - productName
 *               - unit
 *               - prices
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 698bf98bce59f78422bc3881
 *               productName:
 *                 type: string
 *                 example: Tomato
 *               marketId:
 *                 type: string
 *                 description: Required for admin users only
 *                 example: 698be6fb0dcb6e17c14ea180
 *               prices:
 *                 type: object
 *                 required:
 *                   - min
 *                   - max
 *                   - average
 *                 properties:
 *                   min:
 *                     type: number
 *                     example: 18
 *                   max:
 *                     type: number
 *                     example: 26
 *                   average:
 *                     type: number
 *                     example: 22
 *               unit:
 *                 type: string
 *                 example: kg
 *               date:
 *                 type: string
 *                 format: date
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
 *     description: >
 *       Admin users can access any price.
 *       Non-admin users can access only prices from their own market.
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
 *         description: Price details fetched successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Price not found
 */
router.get('/:id', getPriceById);


/**
 * @swagger
 * /api/prices/{id}:
 *   put:
 *     summary: Update price
 *     description: >
 *       Admin users can update any price.
 *       Non-admin users can update prices only in their own market.
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
 *               prices:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     example: 20
 *                   max:
 *                     type: number
 *                     example: 28
 *                   average:
 *                     type: number
 *                     example: 24
 *               unit:
 *                 type: string
 *                 example: kg
 *     responses:
 *       200:
 *         description: Price updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Price not found
 */
router.put('/:id', updatePrice);


/**
 * @swagger
 * /api/prices/{id}:
 *   delete:
 *     summary: Delete price
 *     description: >
 *       Admin users can delete any price.
 *       Non-admin users can delete prices only from their own market.
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
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Price not found
 */
router.delete('/:id', deletePrice);

module.exports = router;
