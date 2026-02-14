require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

console.log('🔥 THIS IS THE ACTIVE SERVER INSTANCE 🔥');

// ROUTES
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

// ERROR HANDLER
const errorHandler = require('./middleware/error.middleware');

const app = express();

/* ---------------- SECURITY ---------------- */
app.use(helmet());

/* ---------------- CORS ---------------- */
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

/* ---------------- BODY PARSER ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- LOGGER ---------------- */
app.use((req, res, next) => {
  console.log('➡️ Incoming:', req.method, req.originalUrl);
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* ---------------- SWAGGER SETUP ---------------- */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reco Ecosystem API',
      version: '1.0.0',
      description: 'Admin Portal API',
      
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5050}`,
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
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

/* ✅ ADD SWAGGER ONLY AFTER INITIALIZATION */
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/* ---------------- HEALTH CHECK ---------------- */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Reco API running',
    timestamp: new Date().toISOString()
  });
});

/* ---------------- API ROUTES ---------------- */
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

/* ---------------- 404 ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* ---------------- ERROR HANDLER ---------------- */
app.use(errorHandler);

/* ---------------- DB + SERVER ---------------- */
/* ---------------- DB + SERVER ---------------- */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // 🚀 DO NOT START SERVER DURING TESTS
    if (process.env.NODE_ENV !== "test") {
      const PORT = process.env.PORT || 5050;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on ${PORT}`);
        console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
      });
    }
  })
  .catch(err => {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  });

module.exports = app;
