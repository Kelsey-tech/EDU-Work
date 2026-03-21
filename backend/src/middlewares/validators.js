const { body } = require('express-validator');

const registerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'company', 'admin']).withMessage('Invalid role'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const jobValidator = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('jobType')
    .isIn(['internship', 'part-time', 'full-time', 'contract'])
    .withMessage('Invalid job type'),
  body('location').optional().trim(),
  body('salary').optional().trim(),
];

const applicationValidator = [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('coverLetter').optional().trim(),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

module.exports = {
  registerValidator,
  loginValidator,
  jobValidator,
  applicationValidator,
  changePasswordValidator,
};