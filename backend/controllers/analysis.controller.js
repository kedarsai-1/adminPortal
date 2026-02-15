const Invoice = require('../models/Invoice.model');
const Inventory = require('../models/Inventory.model');
const Product = require('../models/Product.model');

/**
 * @desc Get high-level KPI summary
 * @route GET /api/analysis/summary
 */
exports.getSummary = async (req, res) => {
  try {
    const businessScope = req.user.role !== 'admin' ? (req.user.businessId || req.user._id) : null;

    const productFilter = businessScope ? { businessId: businessScope } : {};
    const inventoryFilter = businessScope ? { businessId: businessScope } : {};
    const invoiceFilter = businessScope ? { businessId: businessScope } : {};

    const [
      totalProducts,
      totalInventoryItems,
      inventoryAgg,
      invoicesCount,
      salesAgg,
      unpaidAgg
    ] = await Promise.all([
      Product.countDocuments(productFilter),
      Inventory.countDocuments(inventoryFilter),
      Inventory.aggregate([
        { $match: inventoryFilter },
        {
          $group: {
            _id: null,
            totalStock: { $sum: '$currentStock' },
            inventoryValue: { $sum: { $ifNull: ['$totalValue', { $multiply: ['$currentStock', { $ifNull: ['$averageRate', 0] }] }] } }
          }
        }
      ]),
      Invoice.countDocuments(invoiceFilter),
      Invoice.aggregate([
        { $match: { ...invoiceFilter, invoiceType: { $in: ['sale', 'auction'] } } },
        { $group: { _id: null, revenue: { $sum: '$grandTotal' } } }
      ]),
      Invoice.aggregate([
        { $match: { ...invoiceFilter, paymentStatus: { $in: ['unpaid', 'partial', 'overdue'] } } },
        { $group: { _id: null, unpaidBalance: { $sum: '$balanceAmount' } } }
      ])
    ]);

    const totals = inventoryAgg[0] || { totalStock: 0, inventoryValue: 0 };
    const revenue = salesAgg[0]?.revenue || 0;
    const unpaidBalance = unpaidAgg[0]?.unpaidBalance || 0;

    res.json({
      success: true,
      data: {
        totalProducts,
        totalInventoryItems,
        totalStock: totals.totalStock,
        inventoryValue: totals.inventoryValue,
        invoicesCount,
        revenue,
        unpaidBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get analysis summary',
      error: error.message
    });
  }
};

/**
 * @desc Sales trends by day or month
 * @route GET /api/analysis/sales/trends
 */
exports.getSalesTrends = async (req, res) => {
  try {
    const { startDate, endDate, interval = 'day' } = req.query;
    const businessScope = req.user.role !== 'admin' ? (req.user.businessId || req.user._id) : null;

    const match = {
      invoiceType: { $in: ['sale', 'auction'] }
    };
    if (businessScope) match.businessId = businessScope;
    if (startDate || endDate) {
      match.invoiceDate = {};
      if (startDate) match.invoiceDate.$gte = new Date(startDate);
      if (endDate) match.invoiceDate.$lte = new Date(endDate);
    }

    const format = interval === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const results = await Invoice.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format, date: '$invoiceDate' } },
          totalRevenue: { $sum: '$grandTotal' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales trends',
      error: error.message
    });
  }
};

/**
 * @desc Top products by revenue/quantity
 * @route GET /api/analysis/products/top
 */
exports.getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    const businessScope = req.user.role !== 'admin' ? (req.user.businessId || req.user._id) : null;

    const match = {
      invoiceType: { $in: ['sale', 'auction'] }
    };
    if (businessScope) match.businessId = businessScope;
    if (startDate || endDate) {
      match.invoiceDate = {};
      if (startDate) match.invoiceDate.$gte = new Date(startDate);
      if (endDate) match.invoiceDate.$lte = new Date(endDate);
    }

    const results = await Invoice.aggregate([
      { $match: match },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.name' },
          unit: { $first: '$items.unit' },
          revenue: { $sum: '$items.totalAmount' },
          quantity: { $sum: '$items.quantity' },
          count: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: parseInt(limit, 10) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: { $ifNull: ['$productName', '$product.name'] },
          unit: 1,
          revenue: 1,
          quantity: 1,
          count: 1
        }
      }
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top products',
      error: error.message
    });
  }
};

/**
 * @desc Inventory items at/below reorder level
 * @route GET /api/analysis/inventory/low-stock
 */
exports.getLowStock = async (req, res) => {
  try {
    const businessScope = req.user.role !== 'admin' ? (req.user.businessId || req.user._id) : null;
    const query = { $expr: { $lte: ['$currentStock', '$reorderLevel'] } };
    if (businessScope) query.businessId = businessScope;

    const items = await Inventory.find(query)
      .sort({ updatedAt: -1 })
      .populate('productId', 'name unit');

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock items',
      error: error.message
    });
  }
};

/**
 * @desc Stock movements summary
 * @route GET /api/analysis/inventory/movements
 */
exports.getInventoryMovements = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const businessScope = req.user.role !== 'admin' ? (req.user.businessId || req.user._id) : null;

    const matchInventory = businessScope ? { businessId: businessScope } : {};

    const pipeline = [
      { $match: matchInventory },
      { $unwind: '$stockMovements' }
    ];

    if (startDate || endDate) {
      pipeline.push({
        $match: {
          'stockMovements.date': {
            ...(startDate ? { $gte: new Date(startDate) } : {}),
            ...(endDate ? { $lte: new Date(endDate) } : {})
          }
        }
      });
    }

    pipeline.push({
      $group: {
        _id: '$stockMovements.type',
        movements: { $sum: 1 },
        quantity: { $sum: '$stockMovements.quantity' }
      }
    });

    const results = await Inventory.aggregate(pipeline);

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory movements',
      error: error.message
    });
  }
};