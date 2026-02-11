
const User = require('../models/User.model');
const asyncHandler = require('../middleware/asyncHandler');


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const { role, status, search, page = 1, limit = 10 } = req.query;
  
  const query = {};
  
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .populate('businessId', 'name type')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: users.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('businessId');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  await user.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});