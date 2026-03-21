const Job = require('../models/job-model');

// ─── @route  POST /api/jobs ───────────────────────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const createJobPost = async (req, res) => {
  try {
    const { title, description, location, jobType, requirements, salary, applicationDeadline } =
      req.body;

    if (!title || !description || !jobType) {
      return res.status(400).json({ message: 'Title, description, and job type are required.' });
    }

    const job = await Job.create({
      title,
      description,
      companyId: req.user._id,
      location,
      jobType,
      requirements,
      salary,
      applicationDeadline,
    });

    res.status(201).json({ message: 'Job posted successfully.', job });
  } catch (error) {
    res.status(500).json({ message: 'Could not create job post.', error: error.message });
  }
};

// ─── @route  GET /api/jobs ────────────────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const pageSize = parseInt(process.env.DEFAULT_PAGE_SIZE) || 10;
    const page = parseInt(req.query.page) || 1;
    const { jobType, location, search } = req.query;

    const filter = { status: 'open' };
    if (jobType) filter.jobType = jobType;
    if (location) filter.location = new RegExp(location, 'i');
    if (search) filter.$text = { $search: search };

    const totalJobs = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .populate('companyId', 'firstName lastName companyProfile.companyName')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalJobs,
      page,
      totalPages: Math.ceil(totalJobs / pageSize),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve jobs.', error: error.message });
  }
};

// ─── @route  GET /api/jobs/:jobId ────────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      'companyId',
      'firstName lastName companyProfile'
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.status(200).json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve job.', error: error.message });
  }
};

// ─── @route  PUT /api/jobs/:jobId ────────────────────────────────────────────
// ─── @access Private/Company (own posting only) ───────────────────────────────
const updateJobPost = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    const isOwner = job.companyId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not allowed to edit this job post.' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Job updated successfully.', job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: 'Could not update job.', error: error.message });
  }
};

// ─── @route  DELETE /api/jobs/:jobId ─────────────────────────────────────────
// ─── @access Private/Company or Admin ────────────────────────────────────────
const deleteJobPost = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    const isOwner = job.companyId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not allowed to delete this job post.' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete job.', error: error.message });
  }
};

// ─── @route  GET /api/jobs/company/my-jobs ────────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ totalJobs: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve company jobs.', error: error.message });
  }
};

module.exports = {
  createJobPost,
  getAllJobs,
  getJobById,
  updateJobPost,
  deleteJobPost,
  getCompanyJobs,
};