const userService = require('../services/user-service');

// ─── @route  GET /api/users ───────────────────────────────────────────────────
// ─── @access Private/Admin ───────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers({ page: req.query.page });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/users/students ─────────────────────────────────────────
// ─── @access Private/Admin or Company ────────────────────────────────────────
const getAllStudents = async (req, res) => {
  try {
    const result = await userService.getAllStudents({ page: req.query.page });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/users/companies ────────────────────────────────────────
// ─── @access Private/Admin ───────────────────────────────────────────────────
const getAllCompanies = async (req, res) => {
  try {
    const result = await userService.getAllCompanies({ page: req.query.page });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/users/:userId ──────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/users/:userId ──────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.userId, req.user, req.body);
    res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  DELETE /api/users/:userId ───────────────────────────────────────
// ─── @access Private/Admin ───────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllStudents, getAllCompanies, getUserById, updateUser, deleteUser };