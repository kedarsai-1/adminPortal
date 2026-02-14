/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory Management APIs
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getInventory,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  addStockMovement
} = require('../controllers/inventory.controller');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory list fetched
 */
router.get('/', getInventory);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create inventory item
 *     tags: [Inventory]
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
 *               - currentStock
 *               - unit
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 698bf98bce59f78422bc3881
 *               productName:
 *                 type: string
 *                 example: Onion
 *               currentStock:
 *                 type: number
 *                 example: 100
 *               unit:
 *                 type: string
 *                 example: kg
 *               reorderLevel:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Inventory created successfully
 */
router.post('/', createInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get inventory by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inventory ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory details fetched
 */
router.get('/:id', getInventoryById);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inventory ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentStock:
 *                 type: number
 *                 example: 150
 *               reorderLevel:
 *                 type: number
 *                 example: 20
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 */
router.put('/:id', updateInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inventory ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory deleted successfully
 */
router.delete('/:id', deleteInventory);

/**
 * @swagger
 * /api/inventory/{id}/movements:
 *   post:
 *     summary: Add stock movement
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inventory ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: IN
 *               quantity:
 *                 type: number
 *                 example: 50
 *               note:
 *                 type: string
 *                 example: Stock received from supplier
 *     responses:
 *       200:
 *         description: Stock movement added
 */
router.post('/:id/movements', addStockMovement);

module.exports = router;
