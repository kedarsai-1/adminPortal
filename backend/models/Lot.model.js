const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
  lotNumber: {
    type: String,
    required: true,
    unique: true
  },
  auctionDate: {
    type: Date,
    required: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: {
    type: String,
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
  quantity: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  grade: {
    type: String
  },
  quality: {
    type: String,
    enum: ['A', 'B', 'C', 'premium', 'standard', 'below_standard']
  },
  startingPrice: {
    type: Number,
    default: 0
  },
  reservePrice: {
    type: Number
  },
  hamaliCharges: {
    perUnit: Number,
    total: Number
  },
  marketFee: {
    percentage: Number,
    amount: Number
  },
  commissionPercentage: {
    type: Number,
    default: 0
  },
  otherCharges: [{
    name: String,
    amount: Number,
    description: String
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'sold', 'unsold', 'cancelled'],
    default: 'pending'
  },
  auctionResult: {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    buyerName: String,
    finalPrice: Number,
    totalAmount: Number,
    weightRecorded: Number,
    soldAt: Date,
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'completed'],
      default: 'pending'
    }
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
lotSchema.index({ lotNumber: 1 });
lotSchema.index({ auctionDate: 1, businessId: 1 });
lotSchema.index({ status: 1 });
lotSchema.index({ sellerId: 1 });

module.exports = mongoose.model('Lot', lotSchema);