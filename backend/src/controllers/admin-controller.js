const User = require('../models/user-model');
const Job = require('../models/job-model');
const Application = require('../models/application-model');
const { successResponse, errorResponse } = require('../utils/api-response');

// ADMIN DASHBOARD SUMMARY
exports.dashboardSummary = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const jobsCount = await Job.countDocuments();
    const applicationsCount = await Application.countDocuments();

    successResponse(res, { usersCount, jobsCount, applicationsCount }, 'Admin dashboard summary');
  } catch (err) {
    errorResponse(res, err.message);
  }
};