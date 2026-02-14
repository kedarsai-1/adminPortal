const Business = require('../models/Business.model');

// GET /api/businesses
exports.getBusinesses = async (req, res) => {
  try {

    let query = {
      status: { $ne: "inactive" }
    };

    // ⭐ ADMIN CAN SEE ALL BUSINESSES
    if (req.user.role !== "admin") {
      query.ownerId = req.user._id;
    }

    const businesses = await Business.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: businesses.length,
      data: businesses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch businesses",
      error: error.message
    });
  }
};

// POST /api/businesses
exports.createBusiness = async (req, res) => {
  try {
    const business = await Business.create({
      ...req.body,
      ownerId: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Business created successfully',
      data: business
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Business creation failed',
      error: error.message
    });
  }
};

// GET /api/businesses/:id
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business',
      error: error.message
    });
  }
};

// PUT /api/businesses/:id
exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.user._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.json({
      success: true,
      message: 'Business updated successfully',
      data: business
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Business update failed',
      error: error.message
    });
  }
};

// DELETE /api/businesses/:id (Soft delete)
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.user._id
      },
      { status: 'inactive' },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    res.json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Business deletion failed',
      error: error.message
    });
  }
};
