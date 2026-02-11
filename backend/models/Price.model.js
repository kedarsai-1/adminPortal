const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  marketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  marketName: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  prices: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    average: {
      type: Number,
      required: true
    },
    modal: Number
  },
  unit: {
    type: String,
    required: true
  },
  grade: {
    type: String
  },
  quality: {
    type: String
  },
  arrivals: {
    quantity: Number,
    unit: String
  },
  sourceType: {
    type: String,
    enum: ['auction', 'wholesale', 'retail', 'manual'],
    default: 'auction'
  },
  transactionCount: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: true
  },
  location: {
    city: String,
    state: String,
    market: String
  }
}, {
  timestamps: true
});

// Indexes
priceSchema.index({ productId: 1, date: -1 });
priceSchema.index({ marketId: 1, date: -1 });
priceSchema.index({ date: -1 });

module.exports = mongoose.model('Price', priceSchema);
