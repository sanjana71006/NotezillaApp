const StudyGroup = require('../models/StudyGroup');
const Notification = require('../models/Notification');

// Create study group
exports.createStudyGroup = async (req, res) => {
  try {
    const { name, description, subject, maxMembers, isPrivate, tags } = req.body;
    
    const studyGroup = await StudyGroup.create({
      name,
      description,
      subject,
      maxMembers,
      isPrivate,
      tags,
      creator: req.user.id,
      members: [{
        user: req.user.id,
        role: 'admin'
      }]
    });

    res.status(201).json({ success: true, studyGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all study groups
exports.getStudyGroups = async (req, res) => {
  try {
    const { subject, search, myGroups } = req.query;
    let query = { isActive: true };

    if (subject) query.subject = subject;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (myGroups === 'true') {
      query['members.user'] = req.user.id;
    } else {
      // Show only public groups or groups user is member of
      query.$or = [
        { isPrivate: false },
        { 'members.user': req.user.id }
      ];
    }

    const studyGroups = await StudyGroup.find(query)
      .populate('creator', 'username email')
      .populate('members.user', 'username email')
      .sort('-createdAt');

    res.json({ studyGroups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single study group
exports.getStudyGroup = async (req, res) => {
  try {
    const studyGroup = await StudyGroup.findById(req.params.id)
      .populate('creator', 'username email')
      .populate('members.user', 'username email')
      .populate('resources', 'title description fileUrl')
      .populate('joinRequests.user', 'username email');

    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    // Check if user is member or group is public
    const isMember = studyGroup.members.some(m => m.user._id.toString() === req.user.id);
    if (studyGroup.isPrivate && !isMember) {
      return res.status(403).json({ message: 'Private group - membership required' });
    }

    res.json({ studyGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join study group
exports.joinStudyGroup = async (req, res) => {
  try {
    const { message } = req.body;
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    // Check if already member
    const isMember = studyGroup.members.some(m => m.user.toString() === req.user.id);
    if (isMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    // Check if group is full
    if (studyGroup.members.length >= studyGroup.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }

    if (studyGroup.isPrivate) {
      // Add to join requests
      const hasRequested = studyGroup.joinRequests.some(r => r.user.toString() === req.user.id);
      if (hasRequested) {
        return res.status(400).json({ message: 'Join request already sent' });
      }

      studyGroup.joinRequests.push({
        user: req.user.id,
        message
      });

      // Notify group admins
      const admins = studyGroup.members.filter(m => ['admin', 'moderator'].includes(m.role));
      for (const admin of admins) {
        await Notification.create({
          userId: admin.user,
          type: 'system',
          title: 'New Join Request',
          message: `${req.user.username} wants to join "${studyGroup.name}"`,
          relatedId: studyGroup._id,
          relatedModel: 'StudyGroup'
        });
      }

      await studyGroup.save();
      res.json({ success: true, message: 'Join request sent' });
    } else {
      // Direct join for public groups
      studyGroup.members.push({
        user: req.user.id,
        role: 'member'
      });

      await studyGroup.save();
      res.json({ success: true, message: 'Successfully joined group' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve join request (Admin/Moderator only)
exports.approveJoinRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    // Check if user is admin/moderator
    const member = studyGroup.members.find(m => m.user.toString() === req.user.id);
    if (!member || !['admin', 'moderator'].includes(member.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find and remove join request
    const requestIndex = studyGroup.joinRequests.findIndex(r => r.user.toString() === userId);
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    studyGroup.joinRequests.splice(requestIndex, 1);

    // Add user to members
    studyGroup.members.push({
      user: userId,
      role: 'member'
    });

    await studyGroup.save();

    // Notify user
    await Notification.create({
      userId,
      type: 'system',
      title: 'Join Request Approved',
      message: `You have been accepted into "${studyGroup.name}"`,
      relatedId: studyGroup._id,
      relatedModel: 'StudyGroup',
      priority: 'high'
    });

    res.json({ success: true, message: 'Join request approved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Leave study group
exports.leaveStudyGroup = async (req, res) => {
  try {
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    const memberIndex = studyGroup.members.findIndex(m => m.user.toString() === req.user.id);
    if (memberIndex === -1) {
      return res.status(400).json({ message: 'Not a member' });
    }

    // Check if user is the only admin
    const member = studyGroup.members[memberIndex];
    if (member.role === 'admin') {
      const otherAdmins = studyGroup.members.filter(
        m => m.role === 'admin' && m.user.toString() !== req.user.id
      );
      if (otherAdmins.length === 0) {
        return res.status(400).json({ 
          message: 'Cannot leave group - you are the only admin. Please assign another admin first.' 
        });
      }
    }

    studyGroup.members.splice(memberIndex, 1);
    await studyGroup.save();

    res.json({ success: true, message: 'Successfully left group' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update member role (Admin only)
exports.updateMemberRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    // Check if user is admin
    const adminMember = studyGroup.members.find(m => m.user.toString() === req.user.id);
    if (!adminMember || adminMember.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const member = studyGroup.members.find(m => m.user.toString() === userId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.role = role;
    await studyGroup.save();

    res.json({ success: true, message: 'Member role updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Schedule meeting (Admin/Moderator only)
exports.scheduleMeeting = async (req, res) => {
  try {
    const { title, date, time, location, isOnline, meetingLink } = req.body;
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    // Check if user is admin/moderator
    const member = studyGroup.members.find(m => m.user.toString() === req.user.id);
    if (!member || !['admin', 'moderator'].includes(member.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    studyGroup.meetings.push({
      title,
      date,
      time,
      location,
      isOnline,
      meetingLink
    });

    await studyGroup.save();

    // Notify all members
    for (const m of studyGroup.members) {
      await Notification.create({
        userId: m.user,
        type: 'system',
        title: 'New Meeting Scheduled',
        message: `Meeting "${title}" scheduled for ${date} at ${time}`,
        relatedId: studyGroup._id,
        relatedModel: 'StudyGroup'
      });
    }

    res.json({ success: true, message: 'Meeting scheduled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
