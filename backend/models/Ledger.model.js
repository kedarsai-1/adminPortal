const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  partyName: {
    type: String,
    required: true
  },
  partyType: {
    type: String,
    enum: ['buyer', 'seller', 'customer', 'supplier', 'service_provider'],
    required: true
  },
  openingBalance: {
    type: Number,
    default: 0
  },
  openingBalanceType: {
    type: String,
    enum: ['debit', 'credit'],
    default: 'debit'
  },
  transactions: [{
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['invoice', 'payment', 'receipt', 'adjustment', 'opening_balance'],
      required: true
    },
    referenceType: {
      type: String,
      enum: ['invoice', 'lot', 'payment', 'manual']
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },
    referenceNumber: String,
    description: String,
    debit: {
      type: Number,
      default: 0
    },
    credit: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      required: true
    },
    balanceType: {
      type: String,
      enum: ['debit', 'credit']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  currentBalance: {
    type: Number,
    default: 0
  },
  currentBalanceType: {
    type: String,
    enum: ['debit', 'credit'],
    default: 'debit'
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  creditDays: {
    type: Number,
    default: 0
  },
  lastTransactionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
ledgerSchema.index({ businessId: 1, partyId: 1 }, { unique: true });
ledgerSchema.index({ partyType: 1, status: 1 });
ledgerSchema.index({ 'transactions.date': 1 });

// Method to add transaction
ledgerSchema.methods.addTransaction = function(transactionData) {
  const lastBalance = this.transactions.length > 0 
    ? this.transactions[this.transactions.length - 1].balance 
    : this.openingBalance * (this.openingBalanceType === 'credit' ? -1 : 1);
  
  const debit = transactionData.debit || 0;
  const credit = transactionData.credit || 0;
  
  const newBalance = lastBalance + debit - credit;
  
  this.transactions.push({
    ...transactionData,
    balance: Math.abs(newBalance),
    balanceType: newBalance >= 0 ? 'debit' : 'credit'
  });
  
  this.currentBalance = Math.abs(newBalance);
  this.currentBalanceType = newBalance >= 0 ? 'debit' : 'credit';
  this.lastTransactionDate = transactionData.date || new Date();
  
  return this.save();
};

module.exports = mongoose.model('Ledger', ledgerSchema);