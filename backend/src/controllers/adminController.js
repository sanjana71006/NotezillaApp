const User = require('../models/User');
const Resource = require('../models/Resource');
const Analytics = require('../models/Analytics');
const SystemSettings = require('../models/SystemSettings');
const ActivityLog = require('../models/ActivityLog');
const Discussion = require('../models/Discussion');
const Assignment = require('../models/Assignment');
const Comment = require('../models/Comment');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.analytics = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'Student' });
    const facultyCount = await User.countDocuments({ role: 'Faculty' });
    const adminCount = await User.countDocuments({ role: 'Admin' });
    
    const totalResources = await Resource.countDocuments();
    const approvedResources = await Resource.countDocuments({ status: 'approved' });
    const pendingResources = await Resource.countDocuments({ status: 'pending' });
    
    const totalDiscussions = await Discussion.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    
    // Get recent analytics records
    const recentAnalytics = await Analytics.find()
      .sort('-date')
      .limit(30);
    
    // Calculate total downloads
    const resources = await Resource.find().select('downloads');
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    
    res.json({
      users: {
        total: totalUsers,
        students: studentCount,
        faculty: facultyCount,
        admins: adminCount
      },
      resources: {
        total: totalResources,
        approved: approvedResources,
        pending: pendingResources,
        downloads: totalDownloads
      },
      engagement: {
        discussions: totalDiscussions,
        assignments: totalAssignments,
        comments: totalComments
      },
      reports: {
        total: totalReports,
        pending: pendingReports
      },
      trends: recentAnalytics
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Block/Unblock user
exports.blockUser = async (req, res) => {
  try {
    const { block } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isBlocked = block;
    await user.save();
    
    // Create activity log
    await ActivityLog.create({
      user: req.user.id,
      action: block ? 'User blocked' : 'User unblocked',
      actionType: block ? 'block' : 'unblock',
      targetModel: 'User',
      targetId: user._id,
      targetDetails: { username: user.username, email: user.email },
      metadata: { reason: req.body.reason }
    });
    
    // Notify user
    await Notification.create({
      userId: user._id,
      type: 'system',
      title: block ? 'Account Blocked' : 'Account Unblocked',
      message: block ? 'Your account has been blocked' : 'Your account has been unblocked',
      priority: 'high'
    });
    
    res.json({ success: true, message: `User ${block ? 'blocked' : 'unblocked'} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get system settings
exports.getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await SystemSettings.create({});
    }
    
    res.json({ settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update system settings
exports.updateSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    
    if (!settings) {
      settings = new SystemSettings();
    }
    
    Object.assign(settings, req.body);
    settings.updatedBy = req.user.id;
    settings.updatedAt = Date.now();
    
    await settings.save();
    
    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: 'System settings updated',
      actionType: 'update',
      targetModel: 'SystemSettings',
      targetId: settings._id,
      metadata: { changes: req.body }
    });
    
    res.json({ success: true, settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const { userId, actionType, targetModel, limit = 50, offset = 0 } = req.query;
    let query = {};
    
    if (userId) query.user = userId;
    if (actionType) query.actionType = actionType;
    if (targetModel) query.targetModel = targetModel;
    
    const logs = await ActivityLog.find(query)
      .populate('user', 'username email')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await ActivityLog.countDocuments(query);
    
    res.json({
      logs,
      total,
      hasMore: total > parseInt(offset) + logs.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Approve/Reject resource
exports.reviewResource = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    resource.status = status;
    if (status === 'rejected') {
      resource.rejectionReason = rejectionReason;
    }
    
    await resource.save();
    
    // Notify uploader
    await Notification.create({
      userId: resource.uploadedBy,
      type: 'system',
      title: `Resource ${status}`,
      message: status === 'approved' 
        ? `Your resource "${resource.title}" has been approved`
        : `Your resource "${resource.title}" has been rejected: ${rejectionReason}`,
      relatedId: resource._id,
      relatedModel: 'Resource',
      priority: 'high'
    });
    
    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: `Resource ${status}`,
      actionType: status === 'approved' ? 'approve' : 'reject',
      targetModel: 'Resource',
      targetId: resource._id,
      targetDetails: { title: resource.title },
      metadata: { reason: rejectionReason }
    });
    
    res.json({ success: true, resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Today's stats
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const newResourcesToday = await Resource.countDocuments({ createdAt: { $gte: today } });
    const newReportsToday = await Report.countDocuments({ createdAt: { $gte: today } });
    
    // Recent activities
    const recentActivities = await ActivityLog.find()
      .populate('user', 'username')
      .sort('-createdAt')
      .limit(10);
    
    // Pending items
    const pendingResources = await Resource.countDocuments({ status: 'pending' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    
    // Top resources
    const topResources = await Resource.find({ status: 'approved' })
      .sort('-downloads')
      .limit(5)
      .populate('uploadedBy', 'username');
    
    res.json({
      today: {
        newUsers: newUsersToday,
        newResources: newResourcesToday,
        newReports: newReportsToday
      },
      pending: {
        resources: pendingResources,
        reports: pendingReports
      },
      recentActivities,
      topResources
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
