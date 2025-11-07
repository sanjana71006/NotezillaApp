const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
  discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isFlagged: { type: Boolean, default: false },
  flagReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
