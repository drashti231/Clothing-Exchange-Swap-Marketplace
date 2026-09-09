const User = require('../models/User');
const ClothingItem = require('../models/ClothingItem');
const SwapRequest = require('../models/SwapRequest');
const Dispute = require('../models/Dispute');
const Report = require('../models/Report');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await ClothingItem.countDocuments();
    const totalSwaps = await SwapRequest.countDocuments();
    const activeDisputes = await Dispute.countDocuments({ status: 'open' });

    // Aggregations for charts
    const swapStatusData = await SwapRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const categoryData = await ClothingItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      totalItems,
      totalSwaps,
      activeDisputes,
      swapStatusData,
      categoryData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all listings
// @route   GET /api/admin/listings
// @access  Private/Admin
exports.getAllListings = async (req, res) => {
  try {
    const listings = await ClothingItem.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all swaps
// @route   GET /api/admin/swaps
// @access  Private/Admin
exports.getAllSwaps = async (req, res) => {
  try {
    const swaps = await SwapRequest.find()
      .populate('requester', 'name email')
      .populate('receiver', 'name email')
      .populate('offeredItem', 'title images')
      .populate('requestedItem', 'title images')
      .sort({ createdAt: -1 });
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all disputes
// @route   GET /api/admin/disputes
// @access  Private/Admin
exports.getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('swapRequest')
      .populate('raisedBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a dispute
// @route   PUT /api/admin/disputes/:id/resolve
// @access  Private/Admin
exports.resolveDispute = async (req, res) => {
  try {
    const { resolutionNotes } = req.body;
    
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      {
        status: 'resolved',
        resolvedAt: Date.now(),
        resolutionNotes
      },
      { new: true }
    );

    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });
    
    res.json(dispute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block or unblock a user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block admins' });
    
    user.isBlocked = !user.isBlocked;
    await user.save();
    
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admins' });
    
    // Optional: Also delete user's listings and cleanup related swaps/reports
    await ClothingItem.deleteMany({ owner: user._id });
    await Report.deleteMany({ reportedBy: user._id });
    
    await user.deleteOne();
    
    res.json({ message: 'User and their listings deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify or unverify a listing
// @route   PUT /api/admin/listings/:id/verify
// @access  Private/Admin
exports.toggleListingVerification = async (req, res) => {
  try {
    const listing = await ClothingItem.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    
    listing.isVerified = !listing.isVerified;
    await listing.save();
    
    res.json({ message: `Listing ${listing.isVerified ? 'verified' : 'unverified'} successfully`, listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending reports
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: 'pending' })
      .populate('item', 'title')
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dismiss a report
// @route   PUT /api/admin/reports/:id/dismiss
// @access  Private/Admin
exports.dismissReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = 'dismissed';
    await report.save();

    res.json({ message: 'Report dismissed', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove reported item
// @route   DELETE /api/admin/reports/:id/remove-item
// @access  Private/Admin
exports.removeReportedItem = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const item = await ClothingItem.findById(report.item);
    if (item) {
      await item.deleteOne();
    }

    report.status = 'resolved';
    await report.save();

    // Optionally dismiss other pending reports for the same item
    await Report.updateMany({ item: report.item, status: 'pending' }, { status: 'resolved' });

    res.json({ message: 'Item removed and report resolved', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

