const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const studyGroupController = require('../controllers/studyGroupController');

// All routes require authentication
router.use(authenticate);

// Get all study groups
router.get('/', studyGroupController.getStudyGroups);

// Get single study group
router.get('/:id', studyGroupController.getStudyGroup);

// Create study group
router.post('/', studyGroupController.createStudyGroup);

// Join study group
router.post('/:id/join', studyGroupController.joinStudyGroup);

// Leave study group
router.post('/:id/leave', studyGroupController.leaveStudyGroup);

// Approve join request (Admin/Moderator only)
router.post('/:id/approve-request', studyGroupController.approveJoinRequest);

// Update member role (Admin only)
router.put('/:id/member-role', studyGroupController.updateMemberRole);

// Schedule meeting (Admin/Moderator only)
router.post('/:id/schedule-meeting', studyGroupController.scheduleMeeting);

module.exports = router;
