const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceType: {
    type: String,
    enum: ['sale', 'purchase', 'auction', 'service'],
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    required: true
  },
  customerDetails: {
    phone: String,
    email: String,
    address: String,
    gstin: String
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    lotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lot'
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    taxRate: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    }
  }],
  charges: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['hamali', 'commission', 'market_fee', 'transport', 'loading', 'unloading', 'storage', 'other']
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  totalTax: {
    type: Number,
    default: 0
  },
  totalCharges: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true
  },
  roundOff: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'overdue'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer', 'cheque', 'credit']
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balanceAmount: {
    type: Number,
    default: 0
  },
  payments: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: Number,
    method: String,
    reference: String,
    notes: String
  }],
  notes: {
    type: String
  },
  termsAndConditions: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  exportedToTally: {
    type: Boolean,
    default: false
  },
  exportedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ invoiceDate: 1, businessId: 1 });
invoiceSchema.index({ customerId: 1 });
invoiceSchema.index({ paymentStatus: 1 });

// Calculate balance before saving
invoiceSchema.pre('save', async function () {
  this.balanceAmount = this.grandTotal - this.paidAmount;
});

module.exports = mongoose.model('Invoice', invoiceSchema);