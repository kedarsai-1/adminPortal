/**
 * @swagger
 * tags:
 *   name: Lots
 *   description: Auction Lot Management APIs
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getLots,
  createLot,
  getLotById,
  updateLot,
  deleteLot
} = require('../controllers/lot.controller');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/lots:
 *   get:
 *     summary: Get all lots
 *     tags: [Lots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lots fetched
 */
router.get('/', getLots);

/**
 * @swagger
 * /api/lots:
 *   post:
 *     summary: Create a new auction lot
 *     tags: [Lots]
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
 *               - sellerId
 *               - startingPrice
 *             properties:
 *               lotNumber:
 *                 type: string
 *                 example: LOT-1001
 *               productId:
 *                 type: string
 *                 example: 698c3118dfcaeea6167be853
 *               productName:
 *                 type: string
 *                 example: Tomato
 *               sellerId:
 *                 type: string
 *                 example: 698b6b02c926b44a4d7b89cd
 *               sellerName:
 *                 type: string
 *                 example: Kedar Sai
 *               quantity:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                     example: 100
 *                   unit:
 *                     type: string
 *                     example: kg
 *               startingPrice:
 *                 type: number
 *                 example: 25
 *               auctionDate:
 *                 type: string
 *                 example: 2026-02-11
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: Lot created successfully
 */
router.post('/', createLot);

/**
 * @swagger
 * /api/lots/{id}:
 *   get:
 *     summary: Get lot by ID
 *     tags: [Lots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lot ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lot details fetched
 */
router.get('/:id', getLotById);

/**
 * @swagger
 * /api/lots/{id}:
 *   put:
 *     summary: Update lot
 *     tags: [Lots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lot ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startingPrice:
 *                 type: number
 *                 example: 30
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: Lot updated successfully
 */
router.put('/:id', updateLot);

/**
 * @swagger
 * /api/lots/{id}:
 *   delete:
 *     summary: Cancel lot
 *     tags: [Lots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lot ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lot cancelled successfully
 */
router.delete('/:id', deleteLot);

module.exports = router;
