const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{ type: String }],
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now },
    fileUrl: String,
    content: String,
    grade: Number,
    feedback: String,
    status: { type: String, enum: ['pending', 'submitted', 'graded'], default: 'pending' }
  }],
  totalMarks: { type: Number, default: 100 },
  class: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
