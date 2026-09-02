const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', required: true },
  offeredItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', required: true },
  counterOfferItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' },
  initialMessage: { type: String },
  requesterTrackingNumber: { type: String },
  receiverTrackingNumber: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed', 'disputed'], 
    default: 'pending' 
  },
  deliveryMethod: { type: String },
  meetingLocation: { type: String },
  requesterConfirmed: { type: Boolean, default: false },
  receiverConfirmed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
