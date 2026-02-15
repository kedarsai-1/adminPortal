const Price = require('../models/Price.model');


// ==================================================
// GET /api/prices
// ==================================================
exports.getPrices = async (req, res) => {
  try {
    const { productId, marketId, date } = req.query;
    const query = {};

    // 🔐 NON-ADMIN: restrict to user's market
    if (req.user.role !== "admin") {
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "User is not linked to a market"
        });
      }
      query.marketId = req.user.businessId;
    }

    // 🔍 FILTERS
    if (productId) query.productId = productId;

    // Admins may explicitly filter by market
    if (req.user.role === "admin" && marketId) {
      query.marketId = marketId;
    }

    if (date) {
      query.date = {
        $gte: new Date(date),
        $lte: new Date(`${date}T23:59:59.999Z`)
      };
    }

    const prices = await Price.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: prices.length,
      data: prices
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch prices",
      error: error.message
    });
  }
};


// ==================================================
// POST /api/prices
// ==================================================
exports.createPrice = async (req, res) => {
  try {
    let marketId;

    if (req.user.role === "admin") {
      if (!req.body.marketId) {
        return res.status(400).json({
          success: false,
          message: "marketId is required for admin"
        });
      }
      marketId = req.body.marketId;
    } else {
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "User is not linked to a market"
        });
      }
      marketId = req.user.businessId;
    }

    const price = await Price.create({
      ...req.body,
      marketId
    });

    res.status(201).json({
      success: true,
      message: "Price created successfully",
      data: price
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Price creation failed",
      error: error.message
    });
  }
};


// ==================================================
// GET /api/prices/:id
// ==================================================
exports.getPriceById = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price record not found"
      });
    }

    // 🔓 Admin can access any price
    if (req.user.role === "admin") {
      return res.json({
        success: true,
        data: price
      });
    }

    // 🔐 Non-admin authorization
    if (!req.user.businessId) {
      return res.status(403).json({
        success: false,
        message: "User is not linked to a market"
      });
    }

    if (price.marketId.toString() !== req.user.businessId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this price"
      });
    }

    res.json({
      success: true,
      data: price
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch price",
      error: error.message
    });
  }
};


// ==================================================
// PUT /api/prices/:id
// ==================================================
exports.updatePrice = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price record not found"
      });
    }

    // 🔓 Admin allowed
    if (req.user.role !== "admin") {
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "User is not linked to a market"
        });
      }

      if (price.marketId.toString() !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this price"
        });
      }
    }

    const updatedPrice = await Price.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Price updated successfully",
      data: updatedPrice
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Price update failed",
      error: error.message
    });
  }
};


// ==================================================
// DELETE /api/prices/:id
// ==================================================
exports.deletePrice = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price record not found"
      });
    }

    // 🔓 Admin allowed
    if (req.user.role !== "admin") {
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "User is not linked to a market"
        });
      }

      if (price.marketId.toString() !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this price"
        });
      }
    }

    await price.deleteOne();

    res.json({
      success: true,
      message: "Price deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Price deletion failed",
      error: error.message
    });
  }
};
