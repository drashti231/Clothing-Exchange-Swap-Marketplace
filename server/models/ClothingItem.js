const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g. T-Shirt, Jeans
  clothingType: { type: String, required: true }, // Men, Women, Unisex, Kids
  brand: { type: String, required: true }, // Premium, Popular, Standard, Budget, Unknown
  size: { type: String, required: true },
  color: { type: String, required: true },
  condition: { type: String, required: true }, // New with tags, Like new, Good, Fair
  originalPrice: { type: Number },
  estimatedSwapPoints: { type: Number, required: true, default: 0 },
  images: [{ type: String }], // Max 5 Cloudinary URLs
  tags: [{ type: String }],
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  deliveryOptions: [{ type: String }], // Local meetup, courier
  status: { type: String, enum: ['available', 'reserved', 'swapped'], default: 'available' },
  isReported: { type: Boolean, default: false }
}, { timestamps: true });

clothingItemSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
