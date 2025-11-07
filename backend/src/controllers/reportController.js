const Report = require('../models/Report');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');

// Create report
exports.createReport = async (req, res) => {
  try {
    const { reportType, reportedItem, reportedModel, reason, description } = req.body;

    // Check if already reported
    const existingReport = await Report.findOne({
      reportedBy: req.user.id,
      reportedItem,
      status: 'pending'
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this item' });
    }

    const report = await Report.create({
      reportedBy: req.user.id,
      reportType,
      reportedItem,
      reportedModel,
      reason,
      description,
      priority: reportType === 'inappropriate' || reportType === 'spam' ? 'high' : 'medium'
    });

    // Notify admins
    const admins = await User.find({ role: 'Admin' }).select('_id');
    const notifications = admins.map(admin => ({
      userId: admin._id,
      type: 'report',
      title: 'New Report',
      message: `New ${reportType} report filed: ${reason}`,
      relatedId: report._id,
      relatedModel: 'Report',
      priority: report.priority
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ success: true, message: 'Report submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reports (Admin only)
exports.getReports = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, reportType, priority } = req.query;
    let query = {};

    if (status) query.status = status;
    if (reportType) query.reportType = reportType;
    if (priority) query.priority = priority;

    const reports = await Report.find(query)
      .populate('reportedBy', 'username email')
      .populate('resolvedBy', 'username')
      .sort('-createdAt');

    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single report (Admin only)
exports.getReport = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const report = await Report.findById(req.params.id)
      .populate('reportedBy', 'username email')
      .populate('resolvedBy', 'username');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Get the reported item details
    let reportedItemDetails = null;
    switch (report.reportedModel) {
      case 'User':
        reportedItemDetails = await User.findById(report.reportedItem)
          .select('username email role createdAt');
        break;
      case 'Resource':
        reportedItemDetails = await Resource.findById(report.reportedItem)
          .populate('uploadedBy', 'username email');
        break;
      case 'Comment':
        reportedItemDetails = await Comment.findById(report.reportedItem)
          .populate('author', 'username email');
        break;
      case 'Discussion':
        reportedItemDetails = await Discussion.findById(report.reportedItem)
          .populate('author', 'username email');
        break;
    }

    res.json({ report, reportedItemDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update report status (Admin only)
exports.updateReportStatus = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, resolution } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    if (status === 'resolved' || status === 'dismissed') {
      report.resolution = resolution;
      report.resolvedBy = req.user.id;
      report.resolvedAt = Date.now();
    }

    await report.save();

    // Notify reporter
    await Notification.create({
      userId: report.reportedBy,
      type: 'system',
      title: 'Report Status Update',
      message: `Your report has been ${status}`,
      relatedId: report._id,
      relatedModel: 'Report'
    });

    res.json({ success: true, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Take action on reported item (Admin only)
exports.takeAction = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { action } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    let actionTaken = '';

    switch (report.reportedModel) {
      case 'User':
        if (action === 'block') {
          await User.findByIdAndUpdate(report.reportedItem, { isBlocked: true });
          actionTaken = 'User blocked';
        } else if (action === 'warn') {
          // Send warning notification
          await Notification.create({
            userId: report.reportedItem,
            type: 'system',
            title: 'Warning',
            message: 'You have received a warning for violating community guidelines',
            priority: 'high'
          });
          actionTaken = 'Warning sent';
        }
        break;

      case 'Resource':
        if (action === 'remove') {
          await Resource.findByIdAndUpdate(report.reportedItem, { 
            status: 'rejected',
            rejectionReason: report.reason
          });
          actionTaken = 'Resource removed';
        }
        break;

      case 'Comment':
        if (action === 'delete') {
          await Comment.findByIdAndRemove(report.reportedItem);
          actionTaken = 'Comment deleted';
        } else if (action === 'flag') {
          await Comment.findByIdAndUpdate(report.reportedItem, {
            isFlagged: true,
            flagReason: report.reason
          });
          actionTaken = 'Comment flagged';
        }
        break;

      case 'Discussion':
        if (action === 'delete') {
          await Discussion.findByIdAndRemove(report.reportedItem);
          actionTaken = 'Discussion deleted';
        }
        break;
    }

    // Update report
    report.status = 'resolved';
    report.resolution = actionTaken;
    report.resolvedBy = req.user.id;
    report.resolvedAt = Date.now();
    await report.save();

    res.json({ success: true, message: actionTaken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's reports
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user.id })
      .sort('-createdAt');

    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
