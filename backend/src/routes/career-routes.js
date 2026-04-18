const express = require('express');
const router = express.Router();
const { analyzeResume } = require('../controllers/career-controller');
const { protect, authorise } = require('../middlewares/auth-middleware');

// POST /api/career/analyze — student only
router.post('/analyze', protect, authorise('student'), analyzeResume);

module.exports = router;