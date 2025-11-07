const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { 
    type: String, 
    enum: ['user', 'resource', 'comment', 'discussion', 'inappropriate', 'spam', 'copyright'],
    required: true 
  },
  reportedItem: { type: mongoose.Schema.Types.ObjectId, required: true },
  reportedModel: { type: String, required: true },
  reason: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
    default: 'pending'
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  resolution: String,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
