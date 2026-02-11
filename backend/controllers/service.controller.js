const Service = require('../models/Service.model');

/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Private
 */
exports.getServices = async (req, res) => {
  try {
    const { serviceType, status, providerId } = req.query;

    const query = {};

    if (serviceType) query.serviceType = serviceType;
    if (status) query.status = status;
    if (providerId) query.providerId = providerId;

    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .populate('providerId', 'name phone');

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

/**
 * @desc    Create service
 * @route   POST /api/services
 * @access  Private
 */
exports.createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      providerId: req.user._id,
      providerName: req.user.name
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Service creation failed',
      error: error.message
    });
  }
};

/**
 * @desc    Get service by ID
 * @route   GET /api/services/:id
 * @access  Private
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('providerId', 'name phone');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private
 */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      {
        _id: req.params.id,
        providerId: req.user._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Service update failed',
      error: error.message
    });
  }
};

/**
 * @desc    Add booking to service
 * @route   POST /api/services/:id/bookings
 * @access  Private
 */
exports.addBooking = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.bookings.push({
      ...req.body,
      customerId: req.user._id,
      customerName: req.user.name
    });

    await service.save();

    res.json({
      success: true,
      message: 'Booking added successfully',
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add booking',
      error: error.message
    });
  }
};

/**
 * @desc    Delete service (soft delete)
 * @route   DELETE /api/services/:id
 * @access  Private
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      {
        _id: req.params.id,
        providerId: req.user._id
      },
      { status: 'inactive' },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Service deletion failed',
      error: error.message
    });
  }
};
