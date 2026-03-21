const Application = require('../models/application-model');
const Job = require('../models/job-model');

// ─── Submit a new application ─────────────────────────────────────────────────
const submitApplication = async (studentId, { jobId, coverLetter }) => {
  if (!jobId) {
    const error = new Error('Job ID is required.');
    error.status = 400;
    throw error;
  }

  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error('Job not found.');
    error.status = 404;
    throw error;
  }

  if (job.status !== 'open') {
    const error = new Error('This job is no longer accepting applications.');
    error.status = 400;
    throw error;
  }

  const existingApplication = await Application.findOne({ studentId, jobId });
  if (existingApplication) {
    const error = new Error('You have already applied for this job.');
    error.status = 409;
    throw error;
  }

  const application = await Application.create({ studentId, jobId, coverLetter });
  return application;
};

// ─── Get all applications submitted by a student ──────────────────────────────
const getStudentApplications = async (studentId) => {
  const applications = await Application.find({ studentId })
    .populate('jobId', 'title location jobType status companyId')
    .sort({ appliedAt: -1 });

  return { totalApplications: applications.length, applications };
};

// ─── Get all applications for a specific job ──────────────────────────────────
const getApplicationsForJob = async (jobId, requestingUser) => {
  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error('Job not found.');
    error.status = 404;
    throw error;
  }

  const isOwner = job.companyId.toString() === requestingUser._id.toString();
  if (!isOwner && requestingUser.role !== 'admin') {
    const error = new Error('Access denied.');
    error.status = 403;
    throw error;
  }

  const applications = await Application.find({ jobId })
    .populate('studentId', 'firstName lastName email studentProfile')
    .sort({ appliedAt: -1 });

  return { totalApplications: applications.length, jobId, applications };
};

// ─── Update the status of an application ─────────────────────────────────────
const updateApplicationStatus = async (applicationId, requestingUser, status) => {
  const allowedStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

  if (!allowedStatuses.includes(status)) {
    const error = new Error(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}.`);
    error.status = 400;
    throw error;
  }

  const application = await Application.findById(applicationId).populate('jobId');
  if (!application) {
    const error = new Error('Application not found.');
    error.status = 404;
    throw error;
  }

  const isJobOwner =
    application.jobId.companyId.toString() === requestingUser._id.toString();
  if (!isJobOwner && requestingUser.role !== 'admin') {
    const error = new Error('Access denied.');
    error.status = 403;
    throw error;
  }

  application.status = status;
  await application.save();
  return application;
};

// ─── Withdraw a pending application ──────────────────────────────────────────
const withdrawApplication = async (applicationId, studentId) => {
  const application = await Application.findById(applicationId);
  if (!application) {
    const error = new Error('Application not found.');
    error.status = 404;
    throw error;
  }

  const isOwner = application.studentId.toString() === studentId.toString();
  if (!isOwner) {
    const error = new Error('You can only withdraw your own applications.');
    error.status = 403;
    throw error;
  }

  if (application.status !== 'pending') {
    const error = new Error('Only pending applications can be withdrawn.');
    error.status = 400;
    throw error;
  }

  await application.deleteOne();
  return { message: 'Application withdrawn successfully.' };
};

// ─── Get application stats for a company ─────────────────────────────────────
const getApplicationStats = async (companyId) => {
  const jobs = await Job.find({ companyId }).select('_id');
  const jobIds = jobs.map((job) => job._id);

  const total = await Application.countDocuments({ jobId: { $in: jobIds } });
  const pending = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'pending' });
  const reviewed = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'reviewed' });
  const accepted = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'accepted' });
  const rejected = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'rejected' });

  return { total, pending, reviewed, accepted, rejected };
};

module.exports = {
  submitApplication,
  getStudentApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
};