const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');
const CartItem = require('../models/cartItem');
const Product = require('../models/product');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [{ model: Product }],
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + (item.Product.price * item.quantity), 0);

        const options = {
            amount: totalAmount * 100, // Amount in paisa
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);
        res.json({ orderId: order.id, amount: order.amount, currency: order.currency });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;