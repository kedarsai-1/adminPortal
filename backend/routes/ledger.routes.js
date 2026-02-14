/**
 * @swagger
 * tags:
 *   name: Ledgers
 *   description: Ledger Management APIs
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');

const {
  getLedgers,
  createLedger,
  getLedgerById,
  updateLedger,
  deleteLedger
} = require('../controllers/ledger.controller');

const router = express.Router();

/**
 * @swagger
 * /api/ledgers:
 *   get:
 *     summary: Get all ledgers
 *     tags: [Ledgers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ledger list fetched successfully
 */
router.get('/', protect, getLedgers);

/**
 * @swagger
 * /api/ledgers:
 *   post:
 *     summary: Create a new ledger
 *     tags: [Ledgers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partyType
 *               - partyName
 *             properties:
 *               partyType:
 *                 type: string
 *                 example: buyer
 *               partyName:
 *                 type: string
 *                 example: Ravi Traders
 *               partyId:
 *                 type: string
 *                 example: 698be6fb0dcb6e17c14ea180
 *               openingBalance:
 *                 type: number
 *                 example: 0
 *               creditLimit:
 *                 type: number
 *                 example: 50000
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: Ledger created successfully
 */
router.post('/', protect, createLedger);

/**
 * @swagger
 * /api/ledgers/{id}:
 *   get:
 *     summary: Get ledger by ID
 *     tags: [Ledgers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ledger ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ledger details fetched
 */
router.get('/:id', protect, getLedgerById);

/**
 * @swagger
 * /api/ledgers/{id}:
 *   put:
 *     summary: Update ledger
 *     tags: [Ledgers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ledger ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               creditLimit:
 *                 type: number
 *                 example: 75000
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: Ledger updated successfully
 */
router.put('/:id', protect, updateLedger);

/**
 * @swagger
 * /api/ledgers/{id}:
 *   delete:
 *     summary: Delete ledger
 *     tags: [Ledgers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ledger ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ledger deleted successfully
 */
router.delete('/:id', protect, deleteLedger);

module.exports = router;
