const express = require('express');
const router = express.Router();
const { getDashboardStats, getNotifications, markNotificationRead, updateUserProfile, rateUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.put('/profile', updateUserProfile);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.post('/:id/rate', rateUser);

module.exports = router;
