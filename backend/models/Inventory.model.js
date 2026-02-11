const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  sku: {
    type: String
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true
  },
  reorderLevel: {
    type: Number,
    default: 0
  },
  maxStockLevel: {
    type: Number
  },
  location: {
    warehouse: String,
    rack: String,
    bin: String
  },
  stockMovements: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['inward', 'outward', 'adjustment', 'transfer', 'damage', 'return'],
      required: true
    },
    referenceType: {
      type: String,
      enum: ['purchase', 'sale', 'lot', 'invoice', 'manual']
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },
    referenceNumber: String,
    quantity: {
      type: Number,
      required: true
    },
    previousStock: {
      type: Number,
      required: true
    },
    newStock: {
      type: Number,
      required: true
    },
    rate: Number,
    totalValue: Number,
    remarks: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  valuationMethod: {
    type: String,
    enum: ['FIFO', 'LIFO', 'weighted_average'],
    default: 'weighted_average'
  },
  batches: [{
    batchNumber: String,
    quantity: Number,
    purchaseDate: Date,
    expiryDate: Date,
    rate: Number,
    supplier: String
  }],
  averageRate: {
    type: Number,
    default: 0
  },
  totalValue: {
    type: Number,
    default: 0
  },
  lastPurchaseDate: Date,
  lastPurchaseRate: Number,
  lastSaleDate: Date,
  lastSaleRate: Number,
  status: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
    default: 'in_stock'
  }
}, {
  timestamps: true
});

// Indexes
inventorySchema.index({ businessId: 1, productId: 1 }, { unique: true });
inventorySchema.index({ currentStock: 1, reorderLevel: 1 });
inventorySchema.index({ status: 1 });

// Update status based on stock levels
inventorySchema.pre('save', function(next) {
  if (this.currentStock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.currentStock <= this.reorderLevel) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  next();
});

// Method to add stock movement
inventorySchema.methods.addMovement = function(movementData) {
  const previousStock = this.currentStock;
  let quantity = movementData.quantity;
  
  if (movementData.type === 'outward' || movementData.type === 'damage') {
    quantity = -Math.abs(quantity);
  } else {
    quantity = Math.abs(quantity);
  }
  
  const newStock = previousStock + quantity;
  
  this.stockMovements.push({
    ...movementData,
    previousStock,
    newStock,
    quantity: Math.abs(movementData.quantity)
  });
  
  this.currentStock = newStock;
  
  if (movementData.type === 'inward') {
    this.lastPurchaseDate = movementData.date || new Date();
    this.lastPurchaseRate = movementData.rate;
  } else if (movementData.type === 'outward') {
    this.lastSaleDate = movementData.date || new Date();
    this.lastSaleRate = movementData.rate;
  }
  
  // Update average rate and total value
  if (movementData.rate && this.currentStock > 0) {
    this.totalValue = this.currentStock * this.averageRate;
  }
  
  return this.save();
};

module.exports = mongoose.model('Inventory', inventorySchema);