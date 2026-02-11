const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         sku:
 *           type: string
 *         unit:
 *           type: string
 */

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  localName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'meat', 'fmcg', 'fertilizer', 'seeds', 'equipment', 'service']
  },
  subcategory: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  hsn: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'gram', 'liter', 'ml', 'piece', 'dozen', 'box', 'bag', 'quintal', 'ton']
  },
  variants: [{
    name: String,
    value: String,
    sku: String,
    price: Number
  }],
  pricing: {
    basePrice: {
      type: Number,
      default: 0
    },
    sellingPrice: {
      type: Number,
      default: 0
    },
    mrp: {
      type: Number
    },
    minPrice: {
      type: Number
    },
    maxPrice: {
      type: Number
    }
  },
  tax: {
    taxable: {
      type: Boolean,
      default: true
    },
    gstRate: {
      type: Number,
      default: 0
    },
    cessRate: {
      type: Number,
      default: 0
    }
  },
  images: [{
    url: String,
    isPrimary: Boolean
  }],
  specifications: {
    grade: String,
    size: String,
    color: String,
    origin: String,
    brand: String,
    manufacturer: String
  },
  perishable: {
    type: Boolean,
    default: false
  },
  shelfLife: {
    value: Number,
    unit: String
  },
  storageConditions: {
    temperature: String,
    humidity: String,
    instructions: String
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  tags: [String],
  seasonality: {
    available: Boolean,
    season: String,
    peakMonths: [String]
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 'text', localName: 'text', category: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);