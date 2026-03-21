const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getStudentApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/application-controller');
const { protect, authorise } = require('../middlewares/auth-middleware');

// POST /api/applications  — student only
router.post('/', protect, authorise('student'), submitApplication);

// GET /api/applications/my-applications  — student only
router.get('/my-applications', protect, authorise('student'), getStudentApplications);

// GET /api/applications/job/:jobId  — company or admin
router.get('/job/:jobId', protect, authorise('company', 'admin'), getApplicationsForJob);

// PUT /api/applications/:applicationId/status  — company or admin
router.put(
  '/:applicationId/status',
  protect,
  authorise('company', 'admin'),
  updateApplicationStatus
);

// DELETE /api/applications/:applicationId  — student (withdraw)
router.delete('/:applicationId', protect, authorise('student'), withdrawApplication);

module.exports = router;
