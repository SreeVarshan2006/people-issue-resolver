const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin token (no DB lookup needed)
    if (decoded.role === 'admin') {
      req.user = { id: 'admin', role: 'admin', name: 'Admin' };
      return next();
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }
};

// Restrict to admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
};

// Restrict to citizen only
const citizenOnly = (req, res, next) => {
  if (req.user && req.user.role === 'citizen') return next();
  return res.status(403).json({ success: false, message: 'Access denied. Citizens only.' });
};

module.exports = { protect, adminOnly, citizenOnly };
