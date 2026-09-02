const ClothingItem = require('../models/ClothingItem');
const SwapRequest = require('../models/SwapRequest');
const Notification = require('../models/Notification');

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Active listings
    const activeListings = await ClothingItem.countDocuments({ owner: userId, status: 'available' });
    
    // Total points value of active listings
    const items = await ClothingItem.find({ owner: userId, status: 'available' });
    const totalPointsValue = items.reduce((sum, item) => sum + item.estimatedSwapPoints, 0);

    // Pending swaps
    const pendingSwaps = await SwapRequest.countDocuments({
      $or: [{ requester: userId }, { receiver: userId }],
      status: 'pending'
    });

    // Completed swaps
    const completedSwaps = await SwapRequest.countDocuments({
      $or: [{ requester: userId }, { receiver: userId }],
      status: 'completed'
    });

    // Recent items added
    const recentItems = await ClothingItem.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(4);

    res.json({
      stats: {
        activeListings,
        totalPointsValue,
        pendingSwaps,
        completedSwaps
      },
      recentItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
      
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.city = req.body.city !== undefined ? req.body.city : user.city;
      user.state = req.body.state !== undefined ? req.body.state : user.state;
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        city: updatedUser.city,
        state: updatedUser.state,
        avatar: updatedUser.avatar,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate a user post-swap
// @route   POST /api/users/:id/rate
// @access  Private
exports.rateUser = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }

    const User = require('../models/User');
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = targetUser.reviews.find(
      r => r.reviewer.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this user' });
    }

    const review = {
      reviewer: req.user._id,
      rating: Number(rating),
      comment: comment || ''
    };

    targetUser.reviews.push(review);
    targetUser.numReviews = targetUser.reviews.length;
    
    targetUser.rating = targetUser.reviews.reduce((acc, item) => item.rating + acc, 0) / targetUser.reviews.length;

    await targetUser.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
