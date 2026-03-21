const Application = require('../models/application-model');
const Job = require('../models/job-model');

// ─── @route  POST /api/applications ──────────────────────────────────────────
// ─── @access Private/Student ─────────────────────────────────────────────────
const submitApplication = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required.' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is no longer accepting applications.' });
    }

    const existingApplication = await Application.findOne({
      studentId: req.user._id,
      jobId,
    });

    if (existingApplication) {
      return res.status(409).json({ message: 'You have already applied for this job.' });
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId,
      coverLetter,
    });

    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (error) {
    res.status(500).json({ message: 'Could not submit application.', error: error.message });
  }
};

// ─── @route  GET /api/applications/my-applications ───────────────────────────
// ─── @access Private/Student ─────────────────────────────────────────────────
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId', 'title location jobType status companyId')
      .sort({ appliedAt: -1 });

    res.status(200).json({ totalApplications: applications.length, applications });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Could not retrieve your applications.', error: error.message });
  }
};

// ─── @route  GET /api/applications/job/:jobId ─────────────────────────────────
// ─── @access Private/Company ─────────────────────────────────────────────────
const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    const isOwner = job.companyId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'firstName lastName email studentProfile')
      .sort({ appliedAt: -1 });

    res
      .status(200)
      .json({ totalApplications: applications.length, jobId: req.params.jobId, applications });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Could not retrieve job applications.', error: error.message });
  }
};

// ─── @route  PUT /api/applications/:applicationId/status ──────────────────────
// ─── @access Private/Company or Admin ────────────────────────────────────────
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}.`,
      });
    }

    const application = await Application.findById(req.params.applicationId).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    const isJobOwner =
      application.jobId.companyId.toString() === req.user._id.toString();
    if (!isJobOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Application status updated.', application });
  } catch (error) {
    res.status(500).json({ message: 'Could not update application.', error: error.message });
  }
};

// ─── @route  DELETE /api/applications/:applicationId ─────────────────────────
// ─── @access Private/Student (withdraw own application) ──────────────────────
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    const isOwner = application.studentId.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: 'You can only withdraw your own applications.' });
    }

    if (application.status !== 'pending') {
      return res
        .status(400)
        .json({ message: 'Only pending applications can be withdrawn.' });
    }

    await application.deleteOne();
    res.status(200).json({ message: 'Application withdrawn successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not withdraw application.', error: error.message });
  }
};

module.exports = {
  submitApplication,
  getStudentApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  withdrawApplication,
};