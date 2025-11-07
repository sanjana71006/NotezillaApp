const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  course: { type: String },
  metrics: {
    assignmentsCompleted: { type: Number, default: 0 },
    assignmentsTotal: { type: Number, default: 0 },
    averageGrade: { type: Number, default: 0 },
    notesDownloaded: { type: Number, default: 0 },
    discussionParticipation: { type: Number, default: 0 },
    studyHours: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 }
  },
  achievements: [{
    title: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  grades: [{
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    grade: Number,
    maxGrade: Number,
    percentage: Number,
    gradedAt: Date
  }],
  learningPath: [{
    topic: String,
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    completedAt: Date
  }],
  facultyNotes: [{
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    createdAt: { type: Date, default: Date.now }
  }],
  semester: String,
  academicYear: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', ProgressSchema);
