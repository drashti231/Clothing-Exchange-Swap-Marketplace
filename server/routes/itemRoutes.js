const express = require('express');
const router = express.Router();
const {
  createItem,
  updateItem,
  deleteItem,
  getItems,
  getItemById,
  getUserListings,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getItems)
  .post(protect, upload.array('images', 5), createItem);

router.get('/user/listings', protect, getUserListings);

router.route('/:id')
  .get(getItemById)
  .put(protect, upload.array('images', 5), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
