const ClothingItem = require('../models/ClothingItem');
const User = require('../models/User');
const { calculateSwapPoints } = require('../utils/calculator');

// @desc    Create a new clothing listing
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      clothingType,
      brand,
      size,
      color,
      condition,
      originalPrice,
      estimatedSwapPoints,
      tags,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      deliveryOptions,
    } = req.body;

    // Handle images from multer
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => {
        if (file.path && file.path.startsWith('http')) {
          return file.path; // Cloudinary URL
        }
        return `/uploads/${file.filename}`; // Local path
      });
    } else if (req.body.images && Array.isArray(req.body.images)) {
       images = req.body.images; // fallback for seeding
    }

    const item = new ClothingItem({
      owner: req.user._id,
      title,
      description,
      category,
      clothingType,
      brand,
      size,
      color,
      condition,
      originalPrice,
      estimatedSwapPoints: calculateSwapPoints(category, brand, condition),
      images,
      tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags,
      city,
      state,
      postalCode,
      location: {
        type: 'Point',
        coordinates: [longitude || 0, latitude || 0]
      },
      deliveryOptions: typeof deliveryOptions === 'string' ? deliveryOptions.split(',') : deliveryOptions,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a clothing listing
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only owner can update
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => {
        if (file.path && file.path.startsWith('http')) {
          return file.path; // Cloudinary URL
        }
        return `/uploads/${file.filename}`; // Local path
      });
      item.images = [...item.images, ...newImages].slice(0, 5); // Max 5 images
    }

    // Update fields
    const fieldsToUpdate = ['title', 'description', 'category', 'clothingType', 'brand', 'size', 'color', 'condition', 'originalPrice', 'city', 'state', 'postalCode'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    // Recalculate points if category, brand, or condition changed
    if (req.body.category || req.body.brand || req.body.condition) {
      item.estimatedSwapPoints = calculateSwapPoints(item.category, item.brand, item.condition);
    }

    if (req.body.latitude && req.body.longitude) {
      item.location.coordinates = [req.body.longitude, req.body.latitude];
    }
    
    if (req.body.status) item.status = req.body.status;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a clothing listing
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only owner or admin can delete
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all items (Marketplace)
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res) => {
  try {
    const { 
      keyword, category, size, brand, condition, city, state,
      minPoints, maxPoints, sort, page = 1, limit = 12,
      lat, lng, maxDistance 
    } = req.query;

    let query = { status: 'available' };

    // Location based search (GeoJSON)
    // maxDistance is in miles, converting to meters
    if (lat && lng && maxDistance) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(maxDistance) * 1609.34 // 1 mile = 1609.34 meters
        }
      };
    }

    // Search by title or description
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Exact match filters
    if (category) query.category = category;
    if (size) query.size = size;
    if (brand) query.brand = brand;
    if (condition) query.condition = condition;
    if (city) query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    if (state) query.state = { $regex: new RegExp(`^${state}$`, 'i') };

    // Swap points range
    if (minPoints || maxPoints) {
      query.estimatedSwapPoints = {};
      if (minPoints) query.estimatedSwapPoints.$gte = Number(minPoints);
      if (maxPoints) query.estimatedSwapPoints.$lte = Number(maxPoints);
    }

    // Sorting (Omit if using $near because $near automatically sorts by distance)
    let sortObj = {};
    if (!query.location) {
      if (sort === 'oldest') sortObj = { createdAt: 1 };
      else if (sort === 'points_asc') sortObj = { estimatedSwapPoints: 1 };
      else if (sort === 'points_desc') sortObj = { estimatedSwapPoints: -1 };
      else sortObj = { createdAt: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    let queryBuilder = ClothingItem.find(query)
      .populate('owner', 'name avatar rating');
      
    if (!query.location) {
      queryBuilder = queryBuilder.sort(sortObj);
    }
    
    const items = await queryBuilder.skip(skip).limit(Number(limit));

    const total = await ClothingItem.countDocuments(query);

    res.json({
      items,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id).populate('owner', 'name avatar city state rating completedSwaps');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's listings
// @route   GET /api/items/user/listings
// @access  Private
exports.getUserListings = async (req, res) => {
  try {
    const items = await ClothingItem.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
