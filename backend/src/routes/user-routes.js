const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user-controller');
const { protect, authorise } = require('../middlewares/auth-middleware');

// GET /api/users  — admin only
router.get('/', protect, authorise('admin'), getAllUsers);

// GET /api/users/:userId
router.get('/:userId', protect, getUserById);

// PUT /api/users/:userId
router.put('/:userId', protect, updateUser);

// DELETE /api/users/:userId — admin only
router.delete('/:userId', protect, authorise('admin'), deleteUser);

module.exports = router;
