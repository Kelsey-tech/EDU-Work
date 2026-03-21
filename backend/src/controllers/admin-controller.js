const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../middlewares/auth-middleware');
const { dashboardSummary } = require('../controllers/admin-controller');

router.get('/dashboard', protect, authorise('admin'), dashboardSummary);

module.exports = router;