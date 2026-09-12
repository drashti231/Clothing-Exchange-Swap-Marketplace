const SwapRequest = require('../models/SwapRequest');
const ClothingItem = require('../models/ClothingItem');
const Notification = require('../models/Notification');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { isFairMatch } = require('../utils/calculator');

// Helper to send notification
const sendNotification = async (userId, type, title, message, relatedItem, relatedSwap) => {
  await Notification.create({
    user: userId,
    type,
    title,
    message,
    relatedItem,
    relatedSwap
  });
};

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
exports.createSwapRequest = async (req, res) => {
  try {
    const { requestedItemId, offeredItemId, initialMessage, deliveryMethod } = req.body;

    const requestedItem = await ClothingItem.findById(requestedItemId);
    const offeredItem = await ClothingItem.findById(offeredItemId);

    if (!requestedItem || !offeredItem) {
      return res.status(404).json({ message: 'One or both items not found' });
    }

    if (requestedItem.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot request your own item' });
    }
    
    if (offeredItem.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only offer your own items' });
    }

    if (requestedItem.status !== 'available' || offeredItem.status !== 'available') {
      return res.status(400).json({ message: 'One or both items are no longer available' });
    }

    // Check if there is already an active swap request between these items
    const existingSwap = await SwapRequest.findOne({
      requestedItem: requestedItemId,
      offeredItem: offeredItemId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'A swap request already exists for these items' });
    }

    const fairMatch = isFairMatch(requestedItem.estimatedSwapPoints, offeredItem.estimatedSwapPoints);

    const swapRequest = new SwapRequest({
      requester: req.user._id,
      receiver: requestedItem.owner,
      requestedItem: requestedItemId,
      offeredItem: offeredItemId,
      initialMessage,
      deliveryMethod,
      status: 'pending'
    });

    const createdSwap = await swapRequest.save();

    // Create a conversation for this swap request
    const conversation = new Conversation({
      swapRequest: createdSwap._id,
      participants: [req.user._id, requestedItem.owner]
    });
    
    if (initialMessage) {
      const message = new Message({
        conversation: conversation._id,
        sender: req.user._id,
        text: initialMessage
      });
      await message.save();
      conversation.lastMessage = message._id;
      conversation.lastMessageAt = Date.now();
    }
    await conversation.save();

    // Send notification to receiver
    await sendNotification(
      requestedItem.owner,
      'new_swap_request',
      'New Swap Request',
      `${req.user.name} wants to swap their ${offeredItem.title} for your ${requestedItem.title}.`,
      requestedItemId,
      createdSwap._id
    );

    res.status(201).json({ swapRequest: createdSwap, fairMatch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's swap requests
// @route   GET /api/swaps
// @access  Private
exports.getSwapRequests = async (req, res) => {
  try {
    const { type } = req.query; // 'sent' or 'received' or 'all'
    
    let query = {};
    if (type === 'sent') {
      query.requester = req.user._id;
    } else if (type === 'received') {
      query.receiver = req.user._id;
    } else {
      query.$or = [{ requester: req.user._id }, { receiver: req.user._id }];
    }

    if (req.query.status) {
      if (req.query.status === 'active') {
        query.status = { $in: ['pending', 'accepted'] };
      } else if (req.query.status === 'cancelled') {
        query.status = { $in: ['cancelled', 'rejected'] };
      } else {
        query.status = req.query.status;
      }
    }

    const swapRequests = await SwapRequest.find(query)
      .populate('requestedItem', 'title images status estimatedSwapPoints')
      .populate('offeredItem', 'title images status estimatedSwapPoints')
      .populate('counterOfferItem', 'title images status estimatedSwapPoints')
      .populate('requester', 'name avatar rating')
      .populate('receiver', 'name avatar rating')
      .sort({ updatedAt: -1 });

    res.json(swapRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single swap request by ID
// @route   GET /api/swaps/:id
// @access  Private
exports.getSwapById = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('requestedItem')
      .populate('offeredItem')
      .populate('counterOfferItem')
      .populate('requester', 'name avatar rating city state')
      .populate('receiver', 'name avatar rating city state');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Ensure user is part of the swap
    if (swapRequest.requester._id.toString() !== req.user._id.toString() && 
        swapRequest.receiver._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this swap' });
    }

    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update swap request status (accept, reject, cancel, counteroffer, complete)
// @route   PUT /api/swaps/:id/status
// @access  Private
exports.updateSwapStatus = async (req, res) => {
  try {
    const { status, counterOfferItemId } = req.body;
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    const isRequester = swapRequest.requester.toString() === req.user._id.toString();
    const isReceiver = swapRequest.receiver.toString() === req.user._id.toString();

    if (!isRequester && !isReceiver) {
      return res.status(403).json({ message: 'Not authorized to update this swap' });
    }

    // State machine logic
    if (status === 'accepted') {
      if (!isReceiver) return res.status(403).json({ message: 'Only receiver can accept' });
      if (swapRequest.status !== 'pending') return res.status(400).json({ message: 'Swap is not pending' });
      
      swapRequest.status = 'accepted';
      
      // Reserve items
      await ClothingItem.updateMany(
        { _id: { $in: [swapRequest.requestedItem, swapRequest.offeredItem] } },
        { status: 'reserved' }
      );

      await sendNotification(swapRequest.requester, 'swap_accepted', 'Swap Accepted', 'Your swap request was accepted!', swapRequest.requestedItem, swapRequest._id);
    } 
    else if (status === 'rejected') {
      if (!isReceiver) return res.status(403).json({ message: 'Only receiver can reject' });
      swapRequest.status = 'rejected';
      await sendNotification(swapRequest.requester, 'swap_rejected', 'Swap Rejected', 'Your swap request was declined.', swapRequest.requestedItem, swapRequest._id);
    }
    else if (status === 'cancelled') {
      if (!isRequester && !isReceiver) return res.status(403).json({ message: 'Not authorized' });
      
      // If it was accepted, free up the items
      if (swapRequest.status === 'accepted') {
        await ClothingItem.updateMany(
          { _id: { $in: [swapRequest.requestedItem, swapRequest.offeredItem] } },
          { status: 'available' }
        );
      }
      
      swapRequest.status = 'cancelled';
      const notifyTarget = isRequester ? swapRequest.receiver : swapRequest.requester;
      await sendNotification(notifyTarget, 'swap_cancelled', 'Swap Cancelled', 'A swap request was cancelled.', swapRequest.requestedItem, swapRequest._id);
    }
    else if (status === 'completed') {
      if (swapRequest.status !== 'accepted') return res.status(400).json({ message: 'Swap must be accepted first' });
      
      swapRequest.status = 'completed';
      
      // Mark items as swapped
      await ClothingItem.updateMany(
        { _id: { $in: [swapRequest.requestedItem, swapRequest.offeredItem] } },
        { status: 'swapped' }
      );

      const notifyTarget = isRequester ? swapRequest.receiver : swapRequest.requester;
      await sendNotification(notifyTarget, 'swap_completed', 'Swap Completed', 'The swap was marked as completed!', swapRequest.requestedItem, swapRequest._id);
    }
    else if (status === 'counteroffer') {
      if (!isReceiver) return res.status(403).json({ message: 'Only receiver can counteroffer' });
      if (!counterOfferItemId) return res.status(400).json({ message: 'Must provide counter offer item' });
      
      swapRequest.counterOfferItem = counterOfferItemId;
      swapRequest.status = 'pending'; // Stays pending but with counteroffer populated
      await sendNotification(swapRequest.requester, 'swap_counteroffer', 'Counteroffer Received', 'You received a counteroffer.', swapRequest.requestedItem, swapRequest._id);
    }

    const updatedSwap = await swapRequest.save();
    res.json(updatedSwap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tracking number for a swap
// @route   PUT /api/swaps/:id/tracking
// @access  Private
exports.updateTracking = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({ message: 'Swap must be accepted to add tracking' });
    }

    const isRequester = swapRequest.requester.toString() === req.user._id.toString();
    const isReceiver = swapRequest.receiver.toString() === req.user._id.toString();

    if (!isRequester && !isReceiver) {
      return res.status(403).json({ message: 'Not authorized to update this swap' });
    }

    if (!trackingNumber) {
      return res.status(400).json({ message: 'Tracking number is required' });
    }

    let notifyTarget;
    if (isRequester) {
      swapRequest.requesterTrackingNumber = trackingNumber;
      notifyTarget = swapRequest.receiver;
    } else {
      swapRequest.receiverTrackingNumber = trackingNumber;
      notifyTarget = swapRequest.requester;
    }

    await swapRequest.save();

    await sendNotification(
      notifyTarget,
      'shipping_update',
      'Shipping Update',
      'Your swap partner has added a tracking number!',
      swapRequest.requestedItem,
      swapRequest._id
    );

    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
