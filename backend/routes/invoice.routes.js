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

router.use(protect);

// /api/invoices
router
  .route('/')
  .get(getInvoices)
  .post(createInvoice);

// /api/invoices/:id
router
  .route('/:id')
  .get(getInvoiceById)
  .put(updateInvoice)
  .delete(deleteInvoice);

// Payments
router.post('/:id/payments', addPayment);

module.exports = router;
