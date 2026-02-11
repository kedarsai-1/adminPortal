const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getLedgers,
  createLedger,
  getLedgerById,
  updateLedger,
  deleteLedger
} = require('../controllers/ledger.controller');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getLedgers)
  .post(createLedger);

router
  .route('/:id')
  .get(getLedgerById)
  .put(updateLedger)
  .delete(deleteLedger);

module.exports = router;
