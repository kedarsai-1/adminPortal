const Price = require('../models/Price.model');


// ==================================================
// GET /api/prices
// ==================================================
exports.getPrices = async (req, res) => {
  try {
    const { productId, date } = req.query;

    const query = {};

    // 🔐 Non-admin → only their market
    if (req.user.role !== "admin") {
      query.marketId = req.user.businessId || req.user._id;
    }

    if (productId) query.productId = productId;

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
    const price = await Price.create({
      ...req.body,

      // ⭐ MARKET = BUSINESS (source of truth)
      marketId: req.user.businessId || req.user._id,
      marketName: req.user.businessName || undefined
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
    const query = { _id: req.params.id };

    if (req.user.role !== "admin") {
      const businessId = req.user.businessId;
      const userId = req.user._id;

      if (businessId && userId) {
        query.$or = [
          { marketId: businessId },
          { marketId: userId }
        ];
      } else {
        query.marketId = businessId || userId;
      }
    }

    const price = await Price.findOne(query);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price record not found"
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
    delete req.body.marketId; // 🔐 protect ownership

    const price = await Price.findOneAndUpdate(
      {
        _id: req.params.id,
        marketId: req.user.businessId || req.user._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price record not found"
      });
    }

    res.json({
      success: true,
      message: "Price updated successfully",
      data: price
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
    const price = await Price.findOneAndDelete({
      _id: req.params.id,
      marketId: req.user.businessId || req.user._id
    });

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price record not found"
      });
    }

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
