const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'daily'
  },
  metrics: {
    users: {
      totalUsers: Number,
      newUsers: Number,
      activeUsers: Number,
      studentCount: Number,
      facultyCount: Number,
      adminCount: Number
    },
    resources: {
      totalResources: Number,
      newUploads: Number,
      totalDownloads: Number,
      popularResources: [{
        resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
        downloads: Number
      }]
    },
    engagement: {
      totalComments: Number,
      totalDiscussions: Number,
      totalPosts: Number,
      averageSessionDuration: Number,
      pageViews: Number
    },
    academic: {
      assignmentsCreated: Number,
      assignmentsSubmitted: Number,
      averageGrade: Number,
      studyGroupsCreated: Number,
      studyGroupMembers: Number
    },
    system: {
      serverUptime: Number,
      apiCalls: Number,
      errorRate: Number,
      storageUsed: Number
    }
  },
  trends: {
    userGrowth: Number,
    resourceGrowth: Number,
    engagementGrowth: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
