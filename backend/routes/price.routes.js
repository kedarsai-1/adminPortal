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

// 🔐 All price routes are protected
router.use(protect);

// GET /api/prices
// POST /api/prices
router
  .route('/')
  .get(getPrices)
  .post(createPrice);

// GET /api/prices/:id
// PUT /api/prices/:id
// DELETE /api/prices/:id
router
  .route('/:id')
  .get(getPriceById)
  .put(updatePrice)
  .delete(deletePrice);

module.exports = router;
