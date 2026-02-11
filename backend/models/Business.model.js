const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Business:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [auction_market, retail_shop, wholesale, transport, cold_storage, distributor]
 *         gstin:
 *           type: string
 *         pan:
 *           type: string
 */

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['auction_market', 'retail_shop', 'wholesale', 'transport', 'cold_storage', 'distributor', 'manufacturer']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationNumber: {
    type: String,
    trim: true
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  pan: {
    type: String,
    trim: true,
    uppercase: true
  },
  fssai: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, default: 'India' },
    latitude: Number,
    longitude: Number
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  employees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'cashier', 'accountant', 'writer', 'manager', 'porter', 'driver']
    },
    joinedDate: {
      type: Date,
      default: Date.now
    }
  }],
  devices: [{
    deviceType: {
      type: String,
      enum: ['weighing_scale', 'printer_80mm', 'printer_55mm', 'printer_a4', 'printer_a5', 'barcode_scanner']
    },
    deviceId: String,
    deviceName: String,
    configuration: mongoose.Schema.Types.Mixed,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  settings: {
    defaultCurrency: { type: String, default: 'INR' },
    taxEnabled: { type: Boolean, default: true },
    defaultTaxRate: { type: Number, default: 0 },
    invoicePrefix: String,
    invoiceNumberStart: { type: Number, default: 1 },
    autoExportToTally: { type: Boolean, default: false },
    printSettings: {
      autoprint: Boolean,
      copies: { type: Number, default: 1 },
      paperSize: String
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    features: [String]
  }
}, {
  timestamps: true
});

// Index for location-based queries
businessSchema.index({ 'address.latitude': 1, 'address.longitude': 1 });
businessSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Business', businessSchema);