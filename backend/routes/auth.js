const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_fallback_key', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Public for CITIZEN, Admin-only for POLICE/ADMIN)
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const requestedRole = role || 'CITIZEN';

    // If trying to register as POLICE or ADMIN, require Admin token
    if (requestedRole === 'POLICE' || requestedRole === 'ADMIN') {
      let isAdmin = false;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback_key');
          const requester = await User.findById(decoded.id);
          if (requester && requester.role === 'ADMIN') {
            isAdmin = true;
          }
        } catch (e) {
          // Ignore, isAdmin remains false
        }
      }
      
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only Admins can register POLICE or ADMIN roles' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: requestedRole,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
