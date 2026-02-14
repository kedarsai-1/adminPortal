const Inventory = require('../models/Inventory.model');

/**
 * @desc Get all inventory items
 * @route GET /api/inventory
 */
exports.getInventory = async (req, res) => {
  try {
    const { status, productId } = req.query;

    const query = {};

    // ⭐ ADMIN sees ALL
    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    if (status) query.status = status;
    if (productId) query.productId = productId;

    const inventory = await Inventory.find(query)
      .sort({ updatedAt: -1 })
      .populate("productId", "name unit");

    res.json({
      success: true,
      count: inventory.length,
      data: inventory,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
};

/**
 * @desc Create inventory
 * @route POST /api/inventory
 */
exports.createInventory = async (req, res) => {
  try {

    const inventory = await Inventory.create({
      ...req.body,
      businessId: req.user.businessId || req.user._id,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      data: inventory,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Inventory creation failed",
      error: error.message,
    });
  }
};

/**
 * @desc Get inventory by ID
 */
exports.getInventoryById = async (req, res) => {
  try {

    const query = { _id: req.params.id };

    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    const inventory = await Inventory.findOne(query)
      .populate("productId", "name unit");

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    res.json({
      success: true,
      data: inventory,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
};

/**
 * @desc Update inventory
 */
exports.updateInventory = async (req, res) => {
  try {

    const query = { _id: req.params.id };

    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    const inventory = await Inventory.findOneAndUpdate(
      query,
      req.body,
      {
        returnDocument: "after", // ⭐ mongoose v8 syntax
        runValidators: true,
      }
    );

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    res.json({
      success: true,
      message: "Inventory updated successfully",
      data: inventory,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Inventory update failed",
      error: error.message,
    });
  }
};

/**
 * @desc Add stock movement
 */
exports.addStockMovement = async (req, res) => {
  try {

    const query = { _id: req.params.id };

    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    const inventory = await Inventory.findOne(query);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    await inventory.addMovement({
      ...req.body,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      message: "Stock movement added successfully",
      data: inventory,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add stock movement",
      error: error.message,
    });
  }
};

/**
 * @desc Delete inventory
 */
exports.deleteInventory = async (req, res) => {
  try {

    const query = { _id: req.params.id };

    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    const inventory = await Inventory.findOneAndDelete(query);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    res.json({
      success: true,
      message: "Inventory deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Inventory deletion failed",
      error: error.message,
    });
  }
};
