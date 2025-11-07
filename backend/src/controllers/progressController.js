const Progress = require('../models/Progress');
const Assignment = require('../models/Assignment');
const Resource = require('../models/Resource');
const Discussion = require('../models/Discussion');

// Get student progress
exports.getProgress = async (req, res) => {
  try {
    const { studentId, subject } = req.query;
    let query = {};

    // Faculty can view any student's progress
    // Students can only view their own
    if (req.user.role === 'Faculty') {
      query.student = studentId || req.user.id;
    } else if (req.user.role === 'Student') {
      query.student = req.user.id;
    } else if (req.user.role === 'Admin') {
      query.student = studentId;
    }

    if (subject) {
      query.subject = subject;
    }

    const progress = await Progress.find(query)
      .populate('student', 'username email')
      .populate('grades.assignmentId', 'title totalMarks')
      .populate('facultyNotes.faculty', 'username');

    res.json({ progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student progress metrics
exports.updateProgress = async (req, res) => {
  try {
    const { studentId, subject, metrics } = req.body;

    // Only faculty and admin can update progress
    if (!['Faculty', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const progress = await Progress.findOneAndUpdate(
      { student: studentId, subject },
      { 
        $set: { 
          metrics,
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add faculty note
exports.addFacultyNote = async (req, res) => {
  try {
    const { studentId, subject, note } = req.body;

    if (req.user.role !== 'Faculty') {
      return res.status(403).json({ message: 'Faculty access required' });
    }

    const progress = await Progress.findOneAndUpdate(
      { student: studentId, subject },
      { 
        $push: { 
          facultyNotes: {
            faculty: req.user.id,
            note
          }
        },
        $set: { updatedAt: Date.now() }
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Award achievement
exports.awardAchievement = async (req, res) => {
  try {
    const { studentId, title, description, icon } = req.body;

    if (!['Faculty', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const progress = await Progress.findOneAndUpdate(
      { student: studentId },
      { 
        $push: { 
          achievements: {
            title,
            description,
            icon
          }
        },
        $set: { updatedAt: Date.now() }
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get analytics for a student
exports.getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.id;

    // Check authorization
    if (req.user.role === 'Student' && studentId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get all progress records
    const progressRecords = await Progress.find({ student: studentId });

    // Get assignments
    const assignments = await Assignment.find({
      'submissions.student': studentId
    });

    // Get resources downloaded
    const resources = await Resource.find({
      'downloads': studentId
    }).countDocuments();

    // Get discussion participation
    const discussions = await Discussion.find({
      $or: [
        { author: studentId },
        { 'replies.author': studentId }
      ]
    }).countDocuments();

    // Calculate analytics
    const analytics = {
      overallProgress: {
        totalSubjects: progressRecords.length,
        averageGrade: 0,
        totalAssignments: 0,
        completedAssignments: 0,
        totalAchievements: 0
      },
      subjectWise: [],
      recentActivity: [],
      strengths: [],
      improvements: []
    };

    // Process progress records
    let totalGrades = 0;
    let gradeCount = 0;

    progressRecords.forEach(record => {
      analytics.overallProgress.totalAssignments += record.metrics.assignmentsTotal || 0;
      analytics.overallProgress.completedAssignments += record.metrics.assignmentsCompleted || 0;
      analytics.overallProgress.totalAchievements += record.achievements.length;

      // Subject-wise breakdown
      const subjectData = {
        subject: record.subject,
        averageGrade: record.metrics.averageGrade || 0,
        assignmentsCompleted: record.metrics.assignmentsCompleted || 0,
        attendance: record.metrics.attendance || 0
      };
      analytics.subjectWise.push(subjectData);

      // Calculate overall average
      if (record.metrics.averageGrade) {
        totalGrades += record.metrics.averageGrade;
        gradeCount++;
      }

      // Identify strengths and improvements
      if (record.metrics.averageGrade >= 80) {
        analytics.strengths.push(record.subject);
      } else if (record.metrics.averageGrade < 60) {
        analytics.improvements.push(record.subject);
      }
    });

    analytics.overallProgress.averageGrade = gradeCount > 0 ? (totalGrades / gradeCount) : 0;

    res.json({ analytics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update learning path
exports.updateLearningPath = async (req, res) => {
  try {
    const { studentId, subject, topic, status } = req.body;

    if (!['Faculty', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const progress = await Progress.findOne({ student: studentId, subject });

    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    const topicIndex = progress.learningPath.findIndex(t => t.topic === topic);
    
    if (topicIndex > -1) {
      progress.learningPath[topicIndex].status = status;
      if (status === 'completed') {
        progress.learningPath[topicIndex].completedAt = Date.now();
      }
    } else {
      progress.learningPath.push({
        topic,
        status,
        completedAt: status === 'completed' ? Date.now() : undefined
      });
    }

    await progress.save();
    res.json({ success: true, progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
