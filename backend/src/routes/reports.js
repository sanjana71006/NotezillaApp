const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// All routes require authentication
router.use(authenticate);

// Create report
router.post('/', reportController.createReport);

// Get user's own reports
router.get('/my-reports', reportController.getMyReports);

// Admin-only routes
router.get('/', authorizeRoles('Admin'), reportController.getReports);
router.get('/:id', authorizeRoles('Admin'), reportController.getReport);
router.put('/:id/status', authorizeRoles('Admin'), reportController.updateReportStatus);
router.post('/:id/action', authorizeRoles('Admin'), reportController.takeAction);

module.exports = router;
