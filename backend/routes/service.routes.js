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

// /api/services
router
  .route('/')
  .get(getServices)
  .post(createService);

// /api/services/:id
router
  .route('/:id')
  .get(getServiceById)
  .put(updateService)
  .delete(deleteService);

// Bookings
router.post('/:id/bookings', addBooking);

module.exports = router;
