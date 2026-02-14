/**
 * @swagger
 * tags:
 *   name: Businesses
 *   description: Business Management APIs
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getBusinesses,
  createBusiness,
  getBusinessById,
  updateBusiness,
  deleteBusiness
} = require('../controllers/business.controller');

const router = express.Router();

/**
 * Apply authentication middleware to all business routes
 */
router.use(protect);

/**
 * @swagger
 * /api/businesses:
 *   get:
 *     summary: Get all businesses
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of businesses
 */
router.get('/', getBusinesses);

/**
 * @swagger
 * /api/businesses:
 *   post:
 *     summary: Create a new business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: Reco Farms
 *               email:
 *                 type: string
 *                 example: info@reco.com
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *     responses:
 *       201:
 *         description: Business created successfully
 */
router.post('/', createBusiness);

/**
 * @swagger
 * /api/businesses/{id}:
 *   get:
 *     summary: Get business by ID
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Business ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business details fetched
 */
router.get('/:id', getBusinessById);

/**
 * @swagger
 * /api/businesses/{id}:
 *   put:
 *     summary: Update business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Business ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Reco Market Updated
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business updated successfully
 */
router.put('/:id', updateBusiness);

/**
 * @swagger
 * /api/businesses/{id}:
 *   delete:
 *     summary: Delete business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Business ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business deleted successfully
 */
router.delete('/:id', deleteBusiness);

module.exports = router;
