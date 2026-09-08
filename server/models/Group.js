const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, default: 'https://via.placeholder.com/800x400?text=Community+Group' },
  category: { type: String, required: true }, // e.g. Vintage, Upcycling, Local Swaps, General
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: { type: String }, // Optional, for local groups
  isPrivate: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
