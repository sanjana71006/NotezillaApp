const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['announcement', 'update', 'resource', 'event', 'general'],
    default: 'general'
  },
  visibility: {
    type: String,
    enum: ['public', 'students', 'faculty', 'specific'],
    default: 'public'
  },
  targetAudience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{
    type: String,
    filename: String,
    fileType: String
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  tags: [String],
  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
