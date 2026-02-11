const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerName: {
    type: String,
    required: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  serviceType: {
    type: String,
    enum: ['transport', 'loading', 'unloading', 'storage', 'cold_storage', 'packaging', 'grading', 'other'],
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  pricing: {
    type: {
      type: String,
      enum: ['per_kg', 'per_quintal', 'per_trip', 'per_km', 'per_hour', 'per_day', 'fixed'],
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    minimumCharge: Number
  },
  capacity: {
    value: Number,
    unit: String,
    available: {
      type: Boolean,
      default: true
    }
  },
  vehicleDetails: {
    type: String,
    vehicleNumber: String,
    vehicleType: {
      type: String,
      enum: ['truck', 'tempo', 'tractor', 'van', 'pickup', 'container']
    },
    capacity: String
  },
  coverage: {
    areas: [String],
    cities: [String],
    states: [String],
    maxDistance: Number
  },
  availability: {
    monday: { available: Boolean, from: String, to: String },
    tuesday: { available: Boolean, from: String, to: String },
    wednesday: { available: Boolean, from: String, to: String },
    thursday: { available: Boolean, from: String, to: String },
    friday: { available: Boolean, from: String, to: String },
    saturday: { available: Boolean, from: String, to: String },
    sunday: { available: Boolean, from: String, to: String }
  },
  bookings: [{
    date: Date,
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    customerName: String,
    from: String,
    to: String,
    quantity: Number,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: String
  }],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['license', 'insurance', 'permit', 'registration', 'other']
    },
    documentNumber: String,
    expiryDate: Date,
    fileUrl: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
serviceSchema.index({ providerId: 1 });
serviceSchema.index({ serviceType: 1, status: 1 });
serviceSchema.index({ 'coverage.cities': 1 });

module.exports = mongoose.model('Service', serviceSchema);