const Discussion = require('../models/Discussion');
const Notification = require('../models/Notification');

// Create discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { title, content, category, subject, tags, attachments } = req.body;
    
    const discussion = await Discussion.create({
      title,
      content,
      category,
      subject,
      tags,
      attachments,
      author: req.user.id
    });

    res.status(201).json({ success: true, discussion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all discussions
exports.getDiscussions = async (req, res) => {
  try {
    const { category, subject, resolved, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (subject) query.subject = subject;
    if (resolved !== undefined) query.isResolved = resolved === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const discussions = await Discussion.find(query)
      .populate('author', 'username email role')
      .sort('-isPinned -createdAt');

    res.json({ discussions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single discussion
exports.getDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username email role')
      .populate('replies.author', 'username email role');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json({ discussion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add reply to discussion
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.replies.push({
      author: req.user.id,
      content
    });

    discussion.updatedAt = Date.now();
    await discussion.save();

    // Notify discussion author if different from reply author
    if (discussion.author.toString() !== req.user.id) {
      await Notification.create({
        userId: discussion.author,
        type: 'forum',
        title: 'New Reply',
        message: `${req.user.username} replied to your discussion "${discussion.title}"`,
        relatedId: discussion._id,
        relatedModel: 'Discussion'
      });
    }

    res.json({ success: true, message: 'Reply added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark reply as answer (Author or Faculty only)
exports.markAsAnswer = async (req, res) => {
  try {
    const { replyId } = req.body;
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Only author or faculty can mark as answer
    if (discussion.author.toString() !== req.user.id && req.user.role !== 'Faculty') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const reply = discussion.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Unmark all other replies
    discussion.replies.forEach(r => r.isAnswer = false);
    reply.isAnswer = true;
    discussion.isResolved = true;

    await discussion.save();
    res.json({ success: true, message: 'Reply marked as answer' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like discussion or reply
exports.toggleLike = async (req, res) => {
  try {
    const { replyId } = req.body;
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (replyId) {
      // Like a reply
      const reply = discussion.replies.id(replyId);
      if (!reply) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      const likeIndex = reply.likes.indexOf(req.user.id);
      if (likeIndex > -1) {
        reply.likes.splice(likeIndex, 1);
      } else {
        reply.likes.push(req.user.id);
      }
    } else {
      // Like the discussion
      const likeIndex = discussion.likes.indexOf(req.user.id);
      if (likeIndex > -1) {
        discussion.likes.splice(likeIndex, 1);
      } else {
        discussion.likes.push(req.user.id);
      }
    }

    await discussion.save();
    res.json({ success: true, discussion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Pin/Unpin discussion (Faculty/Admin only)
exports.togglePin = async (req, res) => {
  try {
    if (!['Faculty', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.json({ success: true, message: `Discussion ${discussion.isPinned ? 'pinned' : 'unpinned'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update discussion (Author only)
exports.updateDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(discussion, req.body);
    discussion.updatedAt = Date.now();
    await discussion.save();

    res.json({ success: true, discussion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete discussion (Author or Admin only)
exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.author.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await discussion.remove();
    res.json({ success: true, message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
