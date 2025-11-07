const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const discussionController = require('../controllers/discussionController');

// All routes require authentication
router.use(authenticate);

// Get all discussions
router.get('/', discussionController.getDiscussions);

// Get single discussion
router.get('/:id', discussionController.getDiscussion);

// Create discussion
router.post('/', discussionController.createDiscussion);

// Update discussion (Author only)
router.put('/:id', discussionController.updateDiscussion);

// Delete discussion (Author or Admin only)
router.delete('/:id', discussionController.deleteDiscussion);

// Add reply
router.post('/:id/reply', discussionController.addReply);

// Mark reply as answer (Author or Faculty only)
router.post('/:id/answer', discussionController.markAsAnswer);

// Toggle like
router.post('/:id/like', discussionController.toggleLike);

// Pin/unpin discussion (Faculty/Admin only)
router.post('/:id/pin', authorizeRoles('Faculty', 'Admin'), discussionController.togglePin);

module.exports = router;
