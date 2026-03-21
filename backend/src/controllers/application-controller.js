const applicationService = require('../services/application-service');

// ─── @route  POST /api/applications ──────────────────────────────────────────
// ─── @access Private/Student ─────────────────────────────────────────────────
const submitApplication = async (req, res) => {
  try {
    const application = await applicationService.submitApplication(req.user._id, req.body);
    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/applications/my-applications ───────────────────────────
// ─── @access Private/Student ─────────────────────────────────────────────────
const getStudentApplications = async (req, res) => {
  try {
    const result = await applicationService.getStudentApplications(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/applications/job/:jobId ────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const getApplicationsForJob = async (req, res) => {
  try {
    const result = await applicationService.getApplicationsForJob(req.params.jobId, req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/applications/:applicationId/status ─────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await applicationService.updateApplicationStatus(
      req.params.applicationId,
      req.user,
      req.body.status
    );
    res.status(200).json({ message: 'Application status updated.', application });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  DELETE /api/applications/:applicationId ─────────────────────────
// ─── @access Private/Student ─────────────────────────────────────────────────
const withdrawApplication = async (req, res) => {
  try {
    const result = await applicationService.withdrawApplication(req.params.applicationId, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/applications/stats ─────────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const getApplicationStats = async (req, res) => {
  try {
    const stats = await applicationService.getApplicationStats(req.user._id);
    res.status(200).json({ stats });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  submitApplication,
  getStudentApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
};