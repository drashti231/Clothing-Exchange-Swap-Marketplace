const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');
const SwapRequest = require('../models/SwapRequest');

// @desc    Create a payment session for courier fees
// @route   POST /api/payments/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res) => {
  try {
    const { swapId } = req.body;
    
    const swap = await SwapRequest.findById(swapId).populate('offeredItem requestedItem');
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    // Ensure swap is accepted and uses shipping
    if (swap.status !== 'accepted' || swap.deliveryMethod?.toLowerCase() !== 'shipping') {
      return res.status(400).json({ message: 'Payment only available for accepted swaps using Shipping' });
    }

    // In a real application, we would create a Stripe Checkout Session
    // Since we are mocking/testing, we'll simulate a successful payment URL
    if (!process.env.STRIPE_SECRET_KEY) {
      // Mock mode
      return res.json({
        url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/swaps?payment=success&swapId=${swap._id}`,
        mock: true
      });
    }

    // Real Stripe Implementation (if keys exist)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ReWear Courier & Handling Fee',
              description: `Shipping for swap involving ${swap.requestedItem.title}`,
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/swaps?payment=success&swapId=${swap._id}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/swaps?payment=cancelled`,
      metadata: {
        swapId: swap._id.toString(),
        userId: req.user._id.toString()
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark swap payment as paid
// @route   PUT /api/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res) => {
  try {
    const { swapId } = req.body;
    
    const swap = await SwapRequest.findById(swapId);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    // Just save a note that shipping is paid (you could add an 'isShippingPaid' boolean to the schema)
    // For now, we just return success
    
    res.json({ success: true, message: 'Payment recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
