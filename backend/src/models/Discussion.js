const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  subject: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  isResolved: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  attachments: [String],
  replies: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isAnswer: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discussion', DiscussionSchema);
