const User = require('../models/user-model');

// ─── @route  GET /api/users ───────────────────────────────────────────────────
// ─── @access Private/Admin ───────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const pageSize = parseInt(process.env.DEFAULT_PAGE_SIZE) || 10;
    const page = parseInt(req.query.page) || 1;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .select('-passwordHash')
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / pageSize),
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve users.', error: error.message });
  }
};

// ─── @route  GET /api/users/:userId ──────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve user.', error: error.message });
  }
};

// ─── @route  PUT /api/users/:userId ──────────────────────────────────────────
// ─── @access Private (own profile or admin) ──────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const isOwnProfile = req.user._id.toString() === req.params.userId;
    const canEdit = isOwnProfile || req.user.role === 'admin';

    if (!canEdit) {
      return res.status(403).json({ message: 'You are not allowed to update this profile.' });
    }

    const allowedFields = ['firstName', 'lastName', 'studentProfile', 'companyProfile'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Could not update user.', error: error.message });
  }
};

// ─── @route  DELETE /api/users/:userId ───────────────────────────────────────
// ─── @access Private/Admin ───────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete user.', error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };