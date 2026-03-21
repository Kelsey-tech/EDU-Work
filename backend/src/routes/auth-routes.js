const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, getMe, changePassword } = require('../controllers/auth-controller');
const { protect } = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validate');
const { registerValidator, loginValidator, changePasswordValidator } = require('../middlewares/validators');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

router.post('/register', registerValidator, validate, registerUser);
router.post('/login', authLimiter, loginValidator, validate, loginUser);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePasswordValidator, validate, changePassword);

module.exports = router;