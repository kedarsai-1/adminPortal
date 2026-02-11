require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
console.log('🔥 THIS IS THE ACTIVE SERVER INSTANCE 🔥');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const businessRoutes = require('./routes/business.routes.js');
const productRoutes = require('./routes/product.routes');
const lotRoutes = require('./routes/lot.routes');
const priceRoutes = require('./routes/price.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const ledgerRoutes = require('./routes/ledger.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const serviceRoutes = require('./routes/service.routes');


// Import middleware
const errorHandler = require('./middleware/error.middleware');


const app = express();
app.use((req, res, next) => {
  console.log('🔥 HIT SERVER:', req.method, req.originalUrl);
  next();
});


// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log('➡️ Incoming:', req.method, req.originalUrl);
  next();
});
app.use(express.urlencoded({ extended: true }));




// Body parser middleware


// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
//
//app.use('/api/', limiter);

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reco Ecosystem API',
      version: '1.0.0',
      description: 'Admin Portal API for Recodesk and Recotrace',
      contact: {
        name: 'Reco Team',
        email: 'support@reco.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js', './models/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Reco API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/products', productRoutes);
app.use('/api/lots', lotRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/ledgers', ledgerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/services', serviceRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

module.exports = app;