const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// All routes require authentication
router.use(authenticate);

// Get user's notifications
router.get('/', notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

// Clear all notifications
router.delete('/', notificationController.clearAllNotifications);

// Get notification settings
router.get('/settings', notificationController.getNotificationSettings);

// Update notification settings
router.put('/settings', notificationController.updateNotificationSettings);

// Create system notification (Admin only)
router.post('/system', authorizeRoles('Admin'), notificationController.createSystemNotification);

module.exports = router;
