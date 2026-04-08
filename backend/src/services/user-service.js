const User = require('../models/user-model');

const DEFAULT_PAGE_SIZE = parseInt(process.env.DEFAULT_PAGE_SIZE) || 10;

const getAllUsers = async ({ page = 1 }) => {
  const totalUsers = await User.countDocuments();
  const users = await User.find()
    .select('-passwordHash')
    .skip((page - 1) * DEFAULT_PAGE_SIZE)
    .limit(DEFAULT_PAGE_SIZE)
    .sort({ createdAt: -1 });
  return { totalUsers, page, totalPages: Math.ceil(totalUsers / DEFAULT_PAGE_SIZE), users };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }
  return user;
};

const updateUser = async (targetUserId, requestingUser, updates) => {
  const isOwnProfile = requestingUser._id.toString() === targetUserId;
  const canEdit = isOwnProfile || requestingUser.role === 'admin';
  if (!canEdit) {
    const error = new Error('You are not allowed to update this profile.');
    error.status = 403;
    throw error;
  }
  const allowedFields = ['firstName', 'lastName', 'studentProfile', 'companyProfile'];
  const sanitisedUpdates = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) sanitisedUpdates[field] = updates[field];
  });
  const updatedUser = await User.findByIdAndUpdate(
    targetUserId,
    { $set: sanitisedUpdates },
    { new: true, runValidators: true }
  ).select('-passwordHash');
  if (!updatedUser) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }
  return updatedUser;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }
  return { message: 'User deleted successfully.' };
};

const getAllStudents = async ({ page = 1 }) => {
  const filter = { role: 'student' };
  const totalStudents = await User.countDocuments(filter);
  const students = await User.find(filter)
    .select('-passwordHash')
    .skip((page - 1) * DEFAULT_PAGE_SIZE)
    .limit(DEFAULT_PAGE_SIZE)
    .sort({ createdAt: -1 });
  return { totalStudents, page, totalPages: Math.ceil(totalStudents / DEFAULT_PAGE_SIZE), students };
};

const getAllCompanies = async ({ page = 1 }) => {
  const filter = { role: 'company' };
  const totalCompanies = await User.countDocuments(filter);
  const companies = await User.find(filter)
    .select('-passwordHash')
    .skip((page - 1) * DEFAULT_PAGE_SIZE)
    .limit(DEFAULT_PAGE_SIZE)
    .sort({ createdAt: -1 });
  return { totalCompanies, page, totalPages: Math.ceil(totalCompanies / DEFAULT_PAGE_SIZE), companies };
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getAllStudents, getAllCompanies };
