const express = require('express');
const router = express.Router();
const {
  createSwapRequest,
  getSwapRequests,
  getSwapById,
  updateSwapStatus,
  updateTracking
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All swap routes are protected

router.route('/')
  .post(createSwapRequest)
  .get(getSwapRequests);

router.route('/:id')
  .get(getSwapById);

router.route('/:id/status')
  .put(updateSwapStatus);

router.route('/:id/tracking')
  .put(updateTracking);

module.exports = router;
