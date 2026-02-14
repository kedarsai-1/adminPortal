/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management APIs
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all active products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
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
 *               - category
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tomato
 *               localName:
 *                 type: string
 *                 example: Tamatar
 *               category:
 *                 type: string
 *                 example: vegetables
 *               unit:
 *                 type: string
 *                 example: kg
 *               pricing:
 *                 type: object
 *                 properties:
 *                   basePrice:
 *                     type: number
 *                     example: 10
 *                   sellingPrice:
 *                     type: number
 *                     example: 25
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/', createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details fetched
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product details
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
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
 *                 example: Tomato Grade A
 *               category:
 *                 type: string
 *                 example: vegetables
 *               unit:
 *                 type: string
 *                 example: kg
 *               pricing:
 *                 type: object
 *                 properties:
 *                   basePrice:
 *                     type: number
 *                     example: 12
 *                   sellingPrice:
 *                     type: number
 *                     example: 28
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put('/:id', updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Soft delete product (status set to inactive)
 *     description: This endpoint does not permanently remove the product. It marks the product as inactive.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product soft deleted successfully
 */
router.delete('/:id', deleteProduct);

module.exports = router;
