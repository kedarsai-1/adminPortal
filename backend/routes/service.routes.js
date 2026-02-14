/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service Management APIs
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
  addBooking
} = require('../controllers/service.controller');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services fetched successfully
 */
router.get('/', getServices);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a service
 *     tags: [Services]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Transportation
 *               description:
 *                 type: string
 *                 example: Truck transportation service
 *               price:
 *                 type: number
 *                 example: 500
 *               unit:
 *                 type: string
 *                 example: trip
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post('/', createService);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details fetched
 */
router.get('/:id', getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 600
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
router.put('/:id', updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 */
router.delete('/:id', deleteService);

/**
 * @swagger
 * /api/services/{id}/bookings:
 *   post:
 *     summary: Add booking to service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: 698b6b02c926b44a4d7b89cd
 *               customerName:
 *                 type: string
 *                 example: Kedar Sai
 *               bookingDate:
 *                 type: string
 *                 example: 2026-02-14
 *               quantity:
 *                 type: number
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: booked
 *     responses:
 *       200:
 *         description: Booking added successfully
 */
router.post('/:id/bookings', addBooking);

module.exports = router;
