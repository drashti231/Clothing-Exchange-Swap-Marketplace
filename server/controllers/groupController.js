const Group = require('../models/Group');
const Post = require('../models/Post');

// @desc    Get all groups
// @route   GET /api/groups
// @access  Public
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('admin', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Public
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('admin', 'name avatar')
      .populate('members', 'name avatar');
    
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res) => {
  try {
    const { name, description, category, location, isPrivate, image } = req.body;
    
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: 'Group name already taken' });
    }

    const group = new Group({
      name,
      description,
      category,
      location,
      isPrivate,
      image,
      admin: req.user._id,
      members: [req.user._id]
    });

    const createdGroup = await group.save();
    res.status(201).json(createdGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join or leave a group
// @route   PUT /api/groups/:id/membership
// @access  Private
exports.toggleMembership = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.includes(req.user._id);

    if (isMember) {
      if (group.admin.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Admin cannot leave the group. Delete it instead.' });
      }
      group.members = group.members.filter(id => id.toString() !== req.user._id.toString());
    } else {
      group.members.push(req.user._id);
    }

    await group.save();
    res.json({ message: isMember ? 'Left group' : 'Joined group', members: group.members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post in a group
// @route   POST /api/groups/:id/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be a member to post' });
    }

    const post = new Post({
      group: group._id,
      author: req.user._id,
      content: req.body.content,
      images: req.body.images || []
    });

    await post.save();
    res.status(201).json(await post.populate('author', 'name avatar'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get group posts
// @route   GET /api/groups/:id/posts
// @access  Public
exports.getGroupPosts = async (req, res) => {
  try {
    const posts = await Post.find({ group: req.params.id })
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/groups/posts/:postId/like
// @access  Private
exports.togglePostLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/groups/posts/:postId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await post.save();
    
    // Return the new comment with populated user
    const updatedPost = await Post.findById(req.params.postId)
      .populate('comments.user', 'name avatar');
      
    res.status(201).json(updatedPost.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
