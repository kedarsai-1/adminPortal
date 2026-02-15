/**
 * @swagger
 * tags:
 *   name: Analysis
 *   description: Analytics and KPI endpoints
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getSummary,
  getSalesTrends,
  getTopProducts,
  getLowStock,
  getInventoryMovements
} = require('../controllers/analysis.controller');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/analysis/summary:
 *   get:
 *     summary: Get KPI summary for the business
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KPI summary fetched successfully
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/analysis/sales/trends:
 *   get:
 *     summary: Get sales trends grouped by day or month
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [day, month]
 *         description: Grouping interval
 *     responses:
 *       200:
 *         description: Sales trends returned
 */
router.get('/sales/trends', getSalesTrends);

/**
 * @swagger
 * /api/analysis/products/top:
 *   get:
 *     summary: Get top products by revenue
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *     responses:
 *       200:
 *         description: Top products returned
 */
router.get('/products/top', getTopProducts);

/**
 * @swagger
 * /api/analysis/inventory/low-stock:
 *   get:
 *     summary: Get low-stock inventory items (at or below reorder)
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock items returned
 */
router.get('/inventory/low-stock', getLowStock);

/**
 * @swagger
 * /api/analysis/inventory/movements:
 *   get:
 *     summary: Get stock movement summary in date range
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock movement summary returned
 */
router.get('/inventory/movements', getInventoryMovements);

module.exports = router;