const Invoice = require('../models/Invoice.model');

/**
 * @desc    Get all invoices
 * @route   GET /api/invoices
 * @access  Private
 */
exports.getInvoices = async (req, res) => {
  try {
    const { invoiceType, paymentStatus, startDate, endDate } = req.query;

    const query = {
    };
    if (req.user.role !== "admin") {
      query.businessId = req.user.businessId || req.user._id;
    }

    if (invoiceType) query.invoiceType = invoiceType;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(query)
      .sort({ invoiceDate: -1 })
      .populate('customerId', 'name')
      .populate('items.productId', 'name');

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
};

/**
 * @desc    Create invoice
 * @route   POST /api/invoices
 * @access  Private
 */
exports.createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({
      ...req.body,
      businessId: req.user.businessId || req.user._id,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invoice creation failed',
      error: error.message
    });
  }
};

/**
 * @desc    Get invoice by ID
 * @route   GET /api/invoices/:id
 * @access  Private
 */
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      businessId: req.user.businessId || req.user._id
    })
      .populate('customerId', 'name')
      .populate('items.productId', 'name')
      .populate('items.lotId', 'lotNumber');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
};

/**
 * @desc    Update invoice
 * @route   PUT /api/invoices/:id
 * @access  Private
 */
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        businessId: req.user.businessId || req.user._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invoice update failed',
      error: error.message
    });
  }
};

/**
 * @desc    Add payment to invoice
 * @route   POST /api/invoices/:id/payments
 * @access  Private
 */
exports.addPayment = async (req, res) => {
  try {
    const { amount, method, reference, notes } = req.body;

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      businessId: req.user.businessId || req.user._id
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    invoice.payments.push({
      amount,
      method,
      reference,
      notes
    });

    invoice.paidAmount += amount;
    invoice.paymentStatus =
      invoice.paidAmount >= invoice.grandTotal
        ? 'paid'
        : 'partial';

    await invoice.save();

    res.json({
      success: true,
      message: 'Payment added successfully',
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add payment',
      error: error.message
    });
  }
};

/**
 * @desc    Delete invoice
 * @route   DELETE /api/invoices/:id
 * @access  Private
 */
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user.businessId || req.user._id
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Invoice deletion failed',
      error: error.message
    });
  }
};
