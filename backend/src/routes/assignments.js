const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const assignmentController = require('../controllers/assignmentController');

// All routes require authentication
router.use(authenticate);

// Get all assignments
router.get('/', assignmentController.getAssignments);

// Get single assignment
router.get('/:id', assignmentController.getAssignment);

// Create assignment (Faculty only)
router.post('/', authorizeRoles('Faculty', 'Admin'), assignmentController.createAssignment);

// Update assignment (Faculty only)
router.put('/:id', authorizeRoles('Faculty', 'Admin'), assignmentController.updateAssignment);

// Delete assignment (Faculty only)
router.delete('/:id', authorizeRoles('Faculty', 'Admin'), assignmentController.deleteAssignment);

// Submit assignment (Student only)
router.post('/:id/submit', authorizeRoles('Student'), assignmentController.submitAssignment);

// Grade assignment (Faculty only)
router.post('/:id/grade', authorizeRoles('Faculty'), assignmentController.gradeAssignment);

module.exports = router;
