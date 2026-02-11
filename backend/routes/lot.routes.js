const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getLots,
  createLot,
  getLotById,
  updateLot,
  deleteLot
} = require('../controllers/lot.controller');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getLots)
  .post(createLot);

router
  .route('/:id')
  .get(getLotById)
  .put(updateLot)
  .delete(deleteLot);

module.exports = router;
