const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All admin endpoints require admin role
router.use(authenticate, authorizeRoles('Admin'));

// User management
router.get('/users', adminController.listUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/block', adminController.blockUser);

// Analytics & Dashboard
router.get('/analytics', adminController.analytics);
router.get('/dashboard-stats', adminController.getDashboardStats);

// System settings
router.get('/settings', adminController.getSystemSettings);
router.put('/settings', adminController.updateSystemSettings);

// Activity logs
router.get('/activity-logs', adminController.getActivityLogs);

// Resource review
router.put('/resources/:id/review', adminController.reviewResource);

module.exports = router;
