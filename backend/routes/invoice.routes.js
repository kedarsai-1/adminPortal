/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice Management APIs
 */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');

const {
  getInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  addPayment
} = require('../controllers/invoice.controller');

const router = express.Router();

// 🔐 All invoice routes protected
router.use(protect);

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invoices fetched
 */
router.get('/', getInvoices);

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *                 example: INV-1001
 *               invoiceType:
 *                 type: string
 *                 example: sale
 *               invoiceDate:
 *                 type: string
 *                 example: 2026-02-13
 *               customerId:
 *                 type: string
 *                 example: 698b6b02c926b44a4d7b89cd
 *               customerName:
 *                 type: string
 *                 example: Kedar Sai
 *               subtotal:
 *                 type: number
 *                 example: 1250
 *               grandTotal:
 *                 type: number
 *                 example: 1250
 *               paymentStatus:
 *                 type: string
 *                 example: unpaid
 *     responses:
 *       201:
 *         description: Invoice created successfully
 */
router.post('/', createInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice details fetched
 */
router.get('/:id', getInvoiceById);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 example: paid
 *               grandTotal:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 */
router.put('/:id', updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 */
router.delete('/:id', deleteInvoice);

/**
 * @swagger
 * /api/invoices/{id}/payments:
 *   post:
 *     summary: Add payment to invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               paymentMode:
 *                 type: string
 *                 example: cash
 *               note:
 *                 type: string
 *                 example: Partial payment received
 *     responses:
 *       200:
 *         description: Payment added successfully
 */
router.post('/:id/payments', addPayment);

module.exports = router;
