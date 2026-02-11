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

// /api/inventory
router
  .route('/')
  .get(getInventory)
  .post(createInventory);

// /api/inventory/:id
router
  .route('/:id')
  .get(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventory);

// Stock movements
router.post('/:id/movements', addStockMovement);

module.exports = router;
