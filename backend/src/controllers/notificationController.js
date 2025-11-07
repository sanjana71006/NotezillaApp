const Notification = require('../models/Notification');

// Get user's notifications
exports.getNotifications = async (req, res) => {
  try {
    const { unreadOnly, type, limit = 20, offset = 0 } = req.query;
    let query = { userId: req.user.id };

    if (unreadOnly === 'true') {
      query.read = false;
    }
    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate('relatedId');

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, read: false });

    res.json({
      notifications,
      total,
      unreadCount,
      hasMore: total > parseInt(offset) + notifications.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.remove();
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear all notifications
exports.clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });
    res.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get notification settings
exports.getNotificationSettings = async (req, res) => {
  try {
    // In a real app, this would come from user preferences
    const settings = {
      email: true,
      push: false,
      types: {
        upload: true,
        comment: true,
        assignment: true,
        grade: true,
        forum: true,
        system: true
      }
    };

    res.json({ settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    // In a real app, this would update user preferences
    const { settings } = req.body;
    
    // Here you would update the user's notification preferences
    res.json({ success: true, message: 'Notification settings updated', settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create system-wide notification (Admin only)
exports.createSystemNotification = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { title, message, priority = 'medium', targetRole } = req.body;
    
    // Get all users based on target role
    const User = require('../models/User');
    let query = {};
    if (targetRole) {
      query.role = targetRole;
    }

    const users = await User.find(query).select('_id');
    
    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      type: 'system',
      title,
      message,
      priority
    }));

    await Notification.insertMany(notifications);

    res.json({ 
      success: true, 
      message: `System notification sent to ${users.length} users` 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
