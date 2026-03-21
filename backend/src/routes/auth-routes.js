const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, getMe } = require('../controllers/auth-controller');
const { protect } = require('../middlewares/auth-middleware');

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', authLimiter, loginUser);

// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
