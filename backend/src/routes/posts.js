const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const postController = require('../controllers/postController');

// All routes require authentication
router.use(authenticate);

// Get all posts
router.get('/', postController.getPosts);

// Get single post
router.get('/:id', postController.getPost);

// Create post (Faculty/Admin only)
router.post('/', authorizeRoles('Faculty', 'Admin'), postController.createPost);

// Update post
router.put('/:id', postController.updatePost);

// Archive post
router.put('/:id/archive', postController.archivePost);

// Delete post
router.delete('/:id', postController.deletePost);

// Toggle like
router.post('/:id/like', postController.toggleLike);

// Add comment
router.post('/:id/comment', postController.addComment);

// Pin/unpin post (Faculty/Admin only)
router.post('/:id/pin', authorizeRoles('Faculty', 'Admin'), postController.togglePin);

module.exports = router;
