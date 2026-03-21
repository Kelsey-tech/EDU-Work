const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth-middleware');
const { dashboardSummary } = require('../controllers/admin-controller');

router.get('/dashboard', auth(['admin']), dashboardSummary);

module.exports = router;