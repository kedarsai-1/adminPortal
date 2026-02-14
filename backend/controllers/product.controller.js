const Product = require('../models/Product.model');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {

    let query = {};

    // ✅ ADMIN sees everything
    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Failed to fetch products",
      error:error.message
    });
  }
};


// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      businessId: req.user.businessId || req.user._id, // ⭐ FIX
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Product creation failed',
      error: error.message
    });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        businessId: req.user.businessId || req.user._id // ⭐ FIX
      },
      req.body,
      {
        returnDocument: "after",   // ✅ NEW SYNTAX (replaces new:true)
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Product update failed",
      error: error.message
    });
  }
};

// DELETE /api/products/:id (Soft delete)
exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { returnDocument: "after" }
    );

    if (!product) {
      return res.status(404).json({
        success:false,
        message:"Product not found"
      });
    }

    res.json({
      success:true,
      message:"Product deleted successfully",
      data:product
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Product deletion failed",
      error:error.message
    });
  }
};

