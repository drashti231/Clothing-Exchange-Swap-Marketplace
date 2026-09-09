const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'Inappropriate content',
      'Counterfeit item',
      'Spam or misleading',
      'Offensive language',
      'Other'
    ]
  },
  details: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'dismissed', 'resolved'],
    default: 'pending'
  }
}, { timestamps: true });

// Ensure a user can only report a specific item once
reportSchema.index({ item: 1, reportedBy: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
