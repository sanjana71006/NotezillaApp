const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
  general: {
    siteName: { type: String, default: 'Notezilla' },
    siteDescription: String,
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: String,
    allowRegistration: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: false },
    defaultUserRole: { type: String, default: 'Student' }
  },
  security: {
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 30 }, // minutes
    passwordMinLength: { type: Number, default: 8 },
    requireStrongPassword: { type: Boolean, default: true },
    sessionTimeout: { type: Number, default: 1440 }, // minutes
    twoFactorAuth: { type: Boolean, default: false }
  },
  resources: {
    maxFileSize: { type: Number, default: 50 }, // MB
    allowedFileTypes: { type: [String], default: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'] },
    autoApproveResources: { type: Boolean, default: false },
    requireModeration: { type: Boolean, default: true }
  },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    notificationTypes: {
      newResource: { type: Boolean, default: true },
      newComment: { type: Boolean, default: true },
      newAssignment: { type: Boolean, default: true },
      gradeReceived: { type: Boolean, default: true }
    }
  },
  limits: {
    maxStudyGroupSize: { type: Number, default: 20 },
    maxUploadsPerDay: { type: Number, default: 10 },
    maxCommentsPerDay: { type: Number, default: 50 },
    maxDiscussionsPerDay: { type: Number, default: 5 }
  },
  features: {
    enableDiscussions: { type: Boolean, default: true },
    enableStudyGroups: { type: Boolean, default: true },
    enableAssignments: { type: Boolean, default: true },
    enableAnalytics: { type: Boolean, default: true },
    enableComments: { type: Boolean, default: true }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
