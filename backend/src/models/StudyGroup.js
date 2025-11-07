const mongoose = require('mongoose');

const StudyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['member', 'moderator', 'admin'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  maxMembers: { type: Number, default: 20 },
  isPrivate: { type: Boolean, default: false },
  joinRequests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    requestedAt: { type: Date, default: Date.now }
  }],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  meetings: [{
    title: String,
    date: Date,
    time: String,
    location: String,
    isOnline: Boolean,
    meetingLink: String
  }],
  tags: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyGroup', StudyGroupSchema);
