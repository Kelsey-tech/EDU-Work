const authService = require('../services/auth-service');

// ─── @route  POST /api/auth/register ─────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  console.log('REGISTER HIT - body:', req.body);
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const result = await authService.registerUser({ firstName, lastName, email, password, role });
    res.status(201).json({ message: 'Account created successfully.', ...result });
  } catch (error) {
    console.log('REGISTER ERROR:', error); // ADD THIS LINE
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  POST /api/auth/login ─────────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const result = await authService.loginUser({ email, password });
    res.status(200).json({ message: 'Login successful.', ...result });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/auth/me ─────────────────────────────────────────────────
// ─── @access Private ──────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/auth/change-password ────────────────────────────────────
// ─── @access Private ──────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    const result = await authService.changePassword(req.user._id, { currentPassword, newPassword });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, changePassword };