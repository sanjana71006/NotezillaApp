const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');
const Progress = require('../models/Progress');

// Create assignment (Faculty only)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, subject, dueDate, totalMarks, attachments, class: className } = req.body;
    
    const assignment = await Assignment.create({
      title,
      description,
      subject,
      dueDate,
      totalMarks,
      attachments,
      class: className,
      createdBy: req.user.id
    });

    // Create notifications for students
    // In a real app, you would notify only students in the specific class
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all assignments for a user
exports.getAssignments = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'Faculty') {
      query.createdBy = req.user.id;
    } else if (req.user.role === 'Student') {
      // Get assignments for student's class
      query = {}; // In real app, filter by student's class
    }

    const assignments = await Assignment.find(query)
      .populate('createdBy', 'username email')
      .sort('-createdAt');

    res.json({ assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single assignment
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('submissions.student', 'username email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit assignment (Student only)
exports.submitAssignment = async (req, res) => {
  try {
    const { fileUrl, content } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user.id
    );

    if (existingSubmission) {
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.content = content;
      existingSubmission.submittedAt = Date.now();
      existingSubmission.status = 'submitted';
    } else {
      assignment.submissions.push({
        student: req.user.id,
        fileUrl,
        content,
        status: 'submitted'
      });
    }

    await assignment.save();

    // Notify faculty
    await Notification.create({
      userId: assignment.createdBy,
      type: 'assignment',
      title: 'New Assignment Submission',
      message: `${req.user.username} has submitted "${assignment.title}"`,
      relatedId: assignment._id,
      relatedModel: 'Assignment'
    });

    res.json({ success: true, message: 'Assignment submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Grade assignment (Faculty only)
exports.gradeAssignment = async (req, res) => {
  try {
    const { studentId, grade, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to grade this assignment' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';

    await assignment.save();

    // Update student progress
    await Progress.findOneAndUpdate(
      { student: studentId, subject: assignment.subject },
      { 
        $push: { 
          grades: {
            assignmentId: assignment._id,
            grade,
            maxGrade: assignment.totalMarks,
            percentage: (grade / assignment.totalMarks) * 100,
            gradedAt: Date.now()
          }
        }
      },
      { upsert: true }
    );

    // Notify student
    await Notification.create({
      userId: studentId,
      type: 'grade',
      title: 'Assignment Graded',
      message: `Your assignment "${assignment.title}" has been graded: ${grade}/${assignment.totalMarks}`,
      relatedId: assignment._id,
      relatedModel: 'Assignment',
      priority: 'high'
    });

    res.json({ success: true, message: 'Assignment graded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update assignment (Faculty only)
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this assignment' });
    }

    Object.assign(assignment, req.body);
    assignment.updatedAt = Date.now();
    await assignment.save();

    res.json({ success: true, assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete assignment (Faculty only)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this assignment' });
    }

    await assignment.remove();
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
