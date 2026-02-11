const Inventory = require('../models/Inventory.model');

/**
 * @desc    Get all inventory items
 * @route   GET /api/inventory
 * @access  Private
 */
exports.getInventory = async (req, res) => {
  try {
    const { status, productId } = req.query;

    const query = {
      businessId: req.user.businessId
    };

    if (status) query.status = status;
    if (productId) query.productId = productId;

    const inventory = await Inventory.find(query)
      .sort({ updatedAt: -1 })
      .populate('productId', 'name unit');

    res.json({
      success: true,
      count: inventory.length,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
};

/**
 * @desc    Create inventory record
 * @route   POST /api/inventory
 * @access  Private
 */
exports.createInventory = async (req, res) => {
  try {
    const inventory = await Inventory.create({
      ...req.body,
      businessId: req.user.businessId
    });

    res.status(201).json({
      success: true,
      message: 'Inventory created successfully',
      data: inventory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Inventory creation failed',
      error: error.message
    });
  }
};

/**
 * @desc    Get inventory by ID
 * @route   GET /api/inventory/:id
 * @access  Private
 */
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    }).populate('productId', 'name unit');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory record not found'
      });
    }

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
};

/**
 * @desc    Update inventory details
 * @route   PUT /api/inventory/:id
 * @access  Private
 */
exports.updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOneAndUpdate(
      {
        _id: req.params.id,
        businessId: req.user.businessId
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory record not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      data: inventory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Inventory update failed',
      error: error.message
    });
  }
};

/**
 * @desc    Add stock movement (inward / outward / adjustment)
 * @route   POST /api/inventory/:id/movements
 * @access  Private
 */
exports.addStockMovement = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory record not found'
      });
    }

    await inventory.addMovement({
      ...req.body,
      createdBy: req.user._id
    });

    res.json({
      success: true,
      message: 'Stock movement added successfully',
      data: inventory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add stock movement',
      error: error.message
    });
  }
};

/**
 * @desc    Delete inventory record
 * @route   DELETE /api/inventory/:id
 * @access  Private
 */
exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory record not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Inventory deletion failed',
      error: error.message
    });
  }
};
