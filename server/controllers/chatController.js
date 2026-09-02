const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get all conversations for a user
// @route   GET /api/chat
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar')
      .populate('lastMessage')
      .populate({
        path: 'swapRequest',
        select: 'requestedItem offeredItem status requesterConfirmed receiverConfirmed requester receiver',
        populate: [
          { path: 'requestedItem', select: 'title images' },
          { path: 'offeredItem', select: 'title images' }
        ]
      })
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/:conversationId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify user is a participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or get a conversation for a swap request
// @route   POST /api/chat
// @access  Private
exports.createOrGetConversation = async (req, res) => {
  try {
    const { swapRequestId } = req.body;
    
    let conversation = await Conversation.findOne({ swapRequest: swapRequestId })
      .populate('participants', 'name avatar');

    if (!conversation) {
      const SwapRequest = require('../models/SwapRequest');
      const swap = await SwapRequest.findById(swapRequestId);
      
      if (!swap) return res.status(404).json({ message: 'Swap request not found' });
      
      if (swap.requester.toString() !== req.user._id.toString() && swap.receiver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      conversation = new Conversation({
        swapRequest: swapRequestId,
        participants: [swap.requester, swap.receiver],
      });
      
      await conversation.save();
      await conversation.populate('participants', 'name avatar');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
