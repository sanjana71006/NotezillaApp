const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const progressController = require('../controllers/progressController');

// All routes require authentication
router.use(authenticate);

// Get progress records
router.get('/', progressController.getProgress);

// Update progress (Faculty/Admin only)
router.put('/', authorizeRoles('Faculty', 'Admin'), progressController.updateProgress);

// Add faculty note (Faculty only)
router.post('/note', authorizeRoles('Faculty'), progressController.addFacultyNote);

// Award achievement (Faculty/Admin only)
router.post('/achievement', authorizeRoles('Faculty', 'Admin'), progressController.awardAchievement);

// Get student analytics
router.get('/analytics/:studentId?', progressController.getStudentAnalytics);

// Update learning path (Faculty/Admin only)
router.put('/learning-path', authorizeRoles('Faculty', 'Admin'), progressController.updateLearningPath);

module.exports = router;
