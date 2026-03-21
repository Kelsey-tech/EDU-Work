const jobService = require('../services/job-service');

// ─── @route  POST /api/jobs ───────────────────────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const createJobPost = async (req, res) => {
  try {
    const job = await jobService.createJobPost(req.user._id, req.body);
    res.status(201).json({ message: 'Job posted successfully.', job });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/jobs ────────────────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const result = await jobService.getAllJobs(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/jobs/:jobId ────────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.jobId);
    res.status(200).json({ job });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/jobs/:jobId ────────────────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const updateJobPost = async (req, res) => {
  try {
    const job = await jobService.updateJobPost(req.params.jobId, req.user, req.body);
    res.status(200).json({ message: 'Job updated successfully.', job });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  DELETE /api/jobs/:jobId ─────────────────────────────────────────
// ─── @access Private/Company or Admin ────────────────────────────────────────
const deleteJobPost = async (req, res) => {
  try {
    const result = await jobService.deleteJobPost(req.params.jobId, req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  GET /api/jobs/company/my-jobs ───────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const getCompanyJobs = async (req, res) => {
  try {
    const result = await jobService.getCompanyJobs(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// ─── @route  PUT /api/jobs/:jobId/close ──────────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const closeJobPost = async (req, res) => {
  try {
    const job = await jobService.closeJobPost(req.params.jobId, req.user);
    res.status(200).json({ message: 'Job closed successfully.', job });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { createJobPost, getAllJobs, getJobById, updateJobPost, deleteJobPost, getCompanyJobs, closeJobPost };