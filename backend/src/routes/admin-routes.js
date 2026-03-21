const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../middlewares/auth-middleware');
const { dashboardSummary, deactivateUser, activateUser } = require('../controllers/admin-controller');

router.get('/dashboard', protect, authorise('admin'), dashboardSummary);
router.put('/users/:userId/deactivate', protect, authorise('admin'), deactivateUser);
router.put('/users/:userId/activate', protect, authorise('admin'), activateUser);

module.exports = router;