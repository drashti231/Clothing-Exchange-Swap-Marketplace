const express = require('express');
const router = express.Router();
const { getPublicProfile, getDashboardStats, getNotifications, markNotificationRead, updateUserProfile, rateUser, updateUserSettings, updateUserPassword, deleteUserAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/:id/profile', getPublicProfile);

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.put('/profile', updateUserProfile);
router.put('/settings', updateUserSettings);
router.put('/password', updateUserPassword);
router.delete('/account', deleteUserAccount);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.post('/:id/rate', rateUser);

module.exports = router;
