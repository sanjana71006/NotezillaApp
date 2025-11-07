const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  actionType: {
    type: String,
    enum: ['create', 'update', 'delete', 'login', 'logout', 'approve', 'reject', 'block', 'unblock', 'upload', 'download'],
    required: true
  },
  targetModel: String,
  targetId: mongoose.Schema.Types.ObjectId,
  targetDetails: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  method: String,
  endpoint: String,
  statusCode: Number,
  metadata: {
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    reason: String,
    notes: String
  },
  duration: Number, // in milliseconds
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient querying
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ actionType: 1, createdAt: -1 });
ActivityLogSchema.index({ targetModel: 1, targetId: 1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
