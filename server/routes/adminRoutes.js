const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getAllUsers,
  getAllListings,
  getAllSwaps,
  getDisputes, 
  resolveDispute, 
  toggleUserBlock,
  toggleListingVerification
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/listings', getAllListings);
router.get('/swaps', getAllSwaps);
router.get('/disputes', getDisputes);
router.put('/disputes/:id/resolve', resolveDispute);
router.put('/users/:id/block', toggleUserBlock);
router.put('/listings/:id/verify', toggleListingVerification);

module.exports = router;
