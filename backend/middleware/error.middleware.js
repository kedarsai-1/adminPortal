// middleware/error.middleware.js
module.exports = (err, req, res, next) => {
  console.error('🔥 ERROR HANDLER:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};
