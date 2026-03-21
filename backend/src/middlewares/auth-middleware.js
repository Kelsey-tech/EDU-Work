const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

// ─── Verify JWT token ─────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  console.log('AUTH HEADER:', req.headers.authorization); // ADD THIS
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorised. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-passwordHash');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    if (!req.user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// ─── Role-based access control ────────────────────────────────────────────────
const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not permitted to perform this action.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorise };