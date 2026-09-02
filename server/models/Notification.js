const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'new_swap_request', 'message'
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' },
  relatedSwap: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
