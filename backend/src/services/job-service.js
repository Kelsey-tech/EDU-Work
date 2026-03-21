const Job = require('../models/job-model');

const DEFAULT_PAGE_SIZE = parseInt(process.env.DEFAULT_PAGE_SIZE) || 10;

const createJobPost = async (companyId, jobData) => {
  const { title, description, location, jobType, requirements, salary, applicationDeadline } = jobData;
  if (!title || !description || !jobType) {
    const error = new Error('Title, description, and job type are required.');
    error.status = 400;
    throw error;
  }
  const job = await Job.create({ title, description, companyId, location, jobType, requirements, salary, applicationDeadline });
  return job;
};

const getAllJobs = async ({ page = 1, jobType, location, search } = {}) => {
  const filter = { status: 'open' };
  if (jobType) filter.jobType = jobType;
  if (location) filter.location = new RegExp(location, 'i');
  if (search) filter.$text = { $search: search };
  const totalJobs = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .populate('companyId', 'firstName lastName companyProfile.companyName')
    .skip((page - 1) * DEFAULT_PAGE_SIZE)
    .limit(DEFAULT_PAGE_SIZE)
    .sort({ createdAt: -1 });
  return { totalJobs, page, totalPages: Math.ceil(totalJobs / DEFAULT_PAGE_SIZE), jobs };
};

const getJobById = async (jobId) => {
  const job = await Job.findById(jobId).populate('companyId', 'firstName lastName companyProfile');
  if (!job) { const error = new Error('Job not found.'); error.status = 404; throw error; }
  return job;
};

const updateJobPost = async (jobId, requestingUser, updates) => {
  const job = await Job.findById(jobId);
  if (!job) { const error = new Error('Job not found.'); error.status = 404; throw error; }
  const isOwner = job.companyId.toString() === requestingUser._id.toString();
  if (!isOwner && requestingUser.role !== 'admin') {
    const error = new Error('You are not allowed to edit this job post.'); error.status = 403; throw error;
  }
  const updatedJob = await Job.findByIdAndUpdate(jobId, { $set: updates }, { new: true, runValidators: true });
  return updatedJob;
};

const deleteJobPost = async (jobId, requestingUser) => {
  const job = await Job.findById(jobId);
  if (!job) { const error = new Error('Job not found.'); error.status = 404; throw error; }
  const isOwner = job.companyId.toString() === requestingUser._id.toString();
  if (!isOwner && requestingUser.role !== 'admin') {
    const error = new Error('You are not allowed to delete this job post.'); error.status = 403; throw error;
  }
  await job.deleteOne();
  return { message: 'Job deleted successfully.' };
};

const getCompanyJobs = async (companyId) => {
  const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });
  return { totalJobs: jobs.length, jobs };
};

const closeJobPost = async (jobId, requestingUser) => {
  const job = await Job.findById(jobId);
  if (!job) { const error = new Error('Job not found.'); error.status = 404; throw error; }
  const isOwner = job.companyId.toString() === requestingUser._id.toString();
  if (!isOwner && requestingUser.role !== 'admin') {
    const error = new Error('You are not allowed to close this job post.'); error.status = 403; throw error;
  }
  job.status = 'closed';
  await job.save();
  return job;
};

module.exports = { createJobPost, getAllJobs, getJobById, updateJobPost, deleteJobPost, getCompanyJobs, closeJobPost };