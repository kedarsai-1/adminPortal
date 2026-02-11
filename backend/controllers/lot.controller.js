const Lot = require('../models/Lot.model');

// GET /api/lots
exports.getLots = async (req, res) => {
  try {
    const lots = await Lot.find({
      businessId: req.user.businessId
    })
      .sort({ auctionDate: -1 })
      .populate('sellerId', 'name')
      .populate('productId', 'name');

    res.json({
      success: true,
      count: lots.length,
      data: lots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lots',
      error: error.message
    });
  }
};

// POST /api/lots
exports.createLot = async (req, res) => {
  try {
    const lot = await Lot.create({
      ...req.body,
      businessId: req.user.businessId,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Lot created successfully',
      data: lot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lot creation failed',
      error: error.message
    });
  }
};

// GET /api/lots/:id
exports.getLotById = async (req, res) => {
  try {
    const lot = await Lot.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    })
      .populate('sellerId', 'name')
      .populate('productId', 'name')
      .populate('auctionResult.buyerId', 'name');

    if (!lot) {
      return res.status(404).json({
        success: false,
        message: 'Lot not found'
      });
    }

    res.json({
      success: true,
      data: lot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lot',
      error: error.message
    });
  }
};

// PUT /api/lots/:id
exports.updateLot = async (req, res) => {
  try {
    const lot = await Lot.findOneAndUpdate(
      {
        _id: req.params.id,
        businessId: req.user.businessId
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!lot) {
      return res.status(404).json({
        success: false,
        message: 'Lot not found'
      });
    }

    res.json({
      success: true,
      message: 'Lot updated successfully',
      data: lot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lot update failed',
      error: error.message
    });
  }
};

// DELETE /api/lots/:id (Soft cancel)
exports.deleteLot = async (req, res) => {
  try {
    const lot = await Lot.findOneAndUpdate(
      {
        _id: req.params.id,
        businessId: req.user.businessId
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!lot) {
      return res.status(404).json({
        success: false,
        message: 'Lot not found'
      });
    }

    res.json({
      success: true,
      message: 'Lot cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lot deletion failed',
      error: error.message
    });
  }
};
