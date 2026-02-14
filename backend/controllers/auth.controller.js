const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const asyncHandler = require('../middleware/asyncHandler');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });


const register = asyncHandler(async (req, res) => {
    console.log('REGISTER BODY:', req.body);
  const { name, email, password, role  } = req.body;  // ✅ DEFAULT VALUE

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password required'
    });
  }
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  const user = await User.create({ name, email, password,role:role || "buyer" });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "buyer"
      },
      token
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    data: {
      token
    }
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = {
  register,
  login,
  getMe
};
