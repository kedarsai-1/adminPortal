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

router.use(protect);

router
  .route('/')
  .get(getBusinesses)
  .post(createBusiness);

router
  .route('/:id')
  .get(getBusinessById)
  .put(updateBusiness)
  .delete(deleteBusiness);

module.exports = router;
