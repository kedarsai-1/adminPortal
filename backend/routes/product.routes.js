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

router
  .route('/')
  .get(getProducts)
  .post(createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
