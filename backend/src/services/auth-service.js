const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = async ({ firstName, lastName, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.status = 409;
    throw error;
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash: password,
    role: role || 'student',
  });

  const token = generateToken(user._id);
  return {
    token,
    user: { userId: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) { const error = new Error('Invalid email or password.'); error.status = 401; throw error; }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) { const error = new Error('Invalid email or password.'); error.status = 401; throw error; }

  if (!user.isActive) { const error = new Error('Account is deactivated.'); error.status = 403; throw error; }

  const token = generateToken(user._id);
  return {
    token,
    user: { userId: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) { const error = new Error('User not found.'); error.status = 404; throw error; }
  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) { const error = new Error('User not found.'); error.status = 404; throw error; }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) { const error = new Error('Current password is incorrect.'); error.status = 401; throw error; }

  user.passwordHash = newPassword;
  await user.save();
  return { message: 'Password changed successfully.' };
};

module.exports = { registerUser, loginUser, getMe, generateToken, changePassword };