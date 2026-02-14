const Ledger = require('../models/Ledger.model');

// GET /api/ledgers
exports.getLedgers = async (req, res) => {
  try {

    let query = {
      status: { $ne: "inactive" }
    };

    // ⭐ Normal users → only their business
    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    const ledgers = await Ledger.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ledgers.length,
      data: ledgers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ledgers",
      error: error.message
    });
  }
};


// POST /api/ledgers
exports.createLedger = async (req, res) => {
  try {
    const ledger = await Ledger.create({
      ...req.body,
      businessId: req.user.businessId || req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Ledger created successfully',
      data: ledger
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Ledger creation failed',
      error: error.message
    });
  }
};

// GET /api/ledgers/:id
exports.getLedgerById = async (req, res) => {
  try {
    const ledger = await Ledger.findOne({
      _id: req.params.id,
      businessId: req.user.businessId || req.user._id
    });

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    res.json({
      success: true,
      data: ledger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ledger',
      error: error.message
    });
  }
};

// PUT /api/ledgers/:id
exports.updateLedger = async (req, res) => {
  try {
    const ledger = await Ledger.findOneAndUpdate(
      {
        _id: req.params.id,
        businessId: req.user.businessId || req.user._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    res.json({
      success: true,
      message: 'Ledger updated successfully',
      data: ledger
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Ledger update failed',
      error: error.message
    });
  }
};

// DELETE /api/ledgers/:id (Soft delete)
exports.deleteLedger = async (req, res) => {
  try {
    const ledger = await Ledger.findOneAndUpdate(
      {
        _id: req.params.id,
        businessId: req.user.businessId || req.user._id
      },
      { status: 'inactive' },
      { new: true }
    );

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: 'Ledger not found'
      });
    }

    res.json({
      success: true,
      message: 'Ledger deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ledger deletion failed',
      error: error.message
    });
  }
};
