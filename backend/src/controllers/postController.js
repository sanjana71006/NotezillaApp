const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, content, type, visibility, targetAudience, attachments, tags } = req.body;

    // Only faculty and admin can create posts
    if (!['Faculty', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to create posts' });
    }

    const post = await Post.create({
      title,
      content,
      type,
      visibility,
      targetAudience,
      attachments,
      tags,
      author: req.user.id
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const { type, search, myPosts } = req.query;
    let query = { isArchived: false };

    // Filter based on visibility and user role
    if (req.user.role === 'Student') {
      query.$or = [
        { visibility: 'public' },
        { visibility: 'students' },
        { targetAudience: req.user.id }
      ];
    } else if (req.user.role === 'Faculty') {
      query.$or = [
        { visibility: 'public' },
        { visibility: 'faculty' },
        { visibility: 'students' },
        { targetAudience: req.user.id }
      ];
    }
    // Admin can see all posts

    if (type) query.type = type;
    if (myPosts === 'true') query.author = req.user.id;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'username email role')
      .sort('-isPinned -createdAt');

    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username email role')
      .populate('comments.author', 'username email role');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like/unlike post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ success: true, likes: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      author: req.user.id,
      content
    });

    await post.save();

    // Notify post author
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        userId: post.author,
        type: 'comment',
        title: 'New Comment',
        message: `${req.user.username} commented on your post "${post.title}"`,
        relatedId: post._id,
        relatedModel: 'Post'
      });
    }

    res.json({ success: true, message: 'Comment added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Pin/unpin post (Admin/Faculty only)
exports.togglePin = async (req, res) => {
  try {
    if (!['Faculty', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({ success: true, message: `Post ${post.isPinned ? 'pinned' : 'unpinned'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Only author or admin can update
    if (post.author.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(post, req.body);
    post.updatedAt = Date.now();
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Archive post
exports.archivePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Only author or admin can archive
    if (post.author.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.isArchived = true;
    await post.save();

    res.json({ success: true, message: 'Post archived' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Only author or admin can delete
    if (post.author.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
