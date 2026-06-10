const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey2024gamestore', {
    expiresIn: '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || null,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('[v0] Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || null,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('[v0] Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('cart.game', 'title price images')
      .populate('wishlist', 'title price images rating')
      .populate('ratings.gameId', 'title _id')
      .populate('comments.gameId', 'title');
    res.json(user);
  } catch (err) {
    console.error('[v0] Profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile avatar
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const shouldRemoveAvatar = req.body.removeAvatar === 'true' || req.body.removeAvatar === true;

    if (shouldRemoveAvatar && user.avatarUrl) {
      const existingMatch = user.avatarUrl.match(/\/uploads\/(.+)$/);
      if (existingMatch) {
        const existingPath = path.join(__dirname, '..', 'uploads', existingMatch[1]);
        if (fs.existsSync(existingPath)) {
          fs.unlinkSync(existingPath);
        }
      }
      user.avatarUrl = undefined;
    }

    if (req.file) {
      if (user.avatarUrl) {
        const existingMatch = user.avatarUrl.match(/\/uploads\/(.+)$/);
        if (existingMatch) {
          const existingPath = path.join(__dirname, '..', 'uploads', existingMatch[1]);
          if (fs.existsSync(existingPath)) {
            fs.unlinkSync(existingPath);
          }
        }
      }
      const avatarPath = `/uploads/${req.file.filename}`;
      user.avatarUrl = `${req.protocol}://${req.get('host')}${avatarPath}`;
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('cart.game', 'title price images')
      .populate('wishlist', 'title price images rating')
      .populate('ratings.gameId', 'title _id')
      .populate('comments.gameId', 'title');

    res.json(updatedUser);
  } catch (err) {
    console.error('[v0] updateProfile error:', err.message);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

module.exports = { register, login, getProfile, updateProfile };
