const express = require('express');
const router = express.Router();
const {
  createJobPost,
  getAllJobs,
  getJobById,
  updateJobPost,
  deleteJobPost,
  getCompanyJobs,
} = require('../controllers/job-controller');
const { protect, authorise } = require('../middlewares/auth-middleware');

// GET /api/jobs  — public
router.get('/', getAllJobs);

// GET /api/jobs/company/my-jobs  — company only
router.get('/company/my-jobs', protect, authorise('company', 'admin'), getCompanyJobs);

// GET /api/jobs/:jobId  — public
router.get('/:jobId', getJobById);

// POST /api/jobs  — company only
router.post('/', protect, authorise('company', 'admin'), createJobPost);

// PUT /api/jobs/:jobId  — company or admin
router.put('/:jobId', protect, authorise('company', 'admin'), updateJobPost);

// DELETE /api/jobs/:jobId  — company or admin
router.delete('/:jobId', protect, authorise('company', 'admin'), deleteJobPost);

module.exports = router;
