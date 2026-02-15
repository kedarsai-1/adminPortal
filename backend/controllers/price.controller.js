const Price = require('../models/Price.model');

// GET /api/prices
exports.getPrices = async (req, res) => {
  try {
    const { productId, marketId, date } = req.query;

    // ⭐ BASE QUERY
    let query = {};

    // ⭐ ADMIN vs USER LOGIC
    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    // ⭐ FILTERS
    if (productId) query.productId = productId;
    if (marketId) query.marketId = marketId;

    if (date) {
      query.date = {
        $gte: new Date(date),
        $lte: new Date(date + "T23:59:59.999Z")
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


// POST /api/prices
exports.createPrice = async (req, res) => {
  try {
    const price = await Price.create({
      ...req.body,
      
      marketId: req.body.marketId || req.user.businessId || req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Price created successfully',
      data: price
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Price creation failed',
      error: error.message
    });
  }
};

exports.getPriceById = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price record not found'
      });
    }

    const userMarketId = (req.user.businessId || req.user._id)?.toString();
    const priceMarketId = (price.marketId || price.businessId)?.toString();

    if (priceMarketId && userMarketId && priceMarketId !== userMarketId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this price'
      });
    }

    res.json({
      success: true,
      data: price
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price',
      error: error.message
    });
  }
};
// PUT /api/prices/:id
exports.updatePrice = async (req, res) => {
  try {
    const price = await Price.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price record not found'
      });
    }

    res.json({
      success: true,
      message: 'Price updated successfully',
      data: price
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Price update failed',
      error: error.message
    });
  }
};

// DELETE /api/prices/:id
exports.deletePrice = async (req, res) => {
  try {
    const price = await Price.findByIdAndDelete(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price record not found'
      });
    }

    res.json({
      success: true,
      message: 'Price deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Price deletion failed',
      error: error.message
    });
  }
};
