const User = require('../models/user-model');
const Job = require('../models/job-model');
const Application = require('../models/application-model');

// ─── @route  GET /api/admin/dashboard ────────────────────────────────────────
// ─── @access Private/Admin ───────────────────────────────────────────────────
const dashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const acceptedApplications = await Application.countDocuments({ status: 'accepted' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

    res.status(200).json({
      users: { totalUsers, totalStudents, totalCompanies },
      jobs: { totalJobs, openJobs },
      applications: { totalApplications, pendingApplications, acceptedApplications, rejectedApplications },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/admin/users/:userId/deactivate ─────────────────────────
// ─── @access Private/Admin ───────────────────────────────────────────────────
const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User deactivated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/admin/users/:userId/activate ───────────────────────────
// ─── @access Private/Admin ───────────────────────────────────────────────────
const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: true },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User activated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { dashboardSummary, deactivateUser, activateUser };