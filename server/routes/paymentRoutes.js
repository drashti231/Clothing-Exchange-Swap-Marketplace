const express = require('express');
const router = express.Router();
const { createCheckoutSession, confirmPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.put('/confirm', protect, confirmPayment);

module.exports = router;
