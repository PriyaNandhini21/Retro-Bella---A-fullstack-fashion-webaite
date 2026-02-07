// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const CartItem = require('../models/cartItem');
const Product = require('../models/product');

// @route   POST /api/cart
// @desc    Add an item to the cart
// @access  Private
router.post('/', auth, async (req, res) => {
 const { productId, quantity } = req.body;
const userId = req.user.id; // Get userId from the decoded JWT

 try {
 let cartItem = await CartItem.findOne({ where: { productId, userId } });

 if (cartItem) {
 // If item already exists in cart, update quantity
 cartItem.quantity += quantity || 1;
 await cartItem.save();
 } else {
 // If item is not in cart, create a new entry
 cartItem = await CartItem.create({
 productId,
 userId,
 quantity: quantity || 1,
 });
}
res.json(cartItem);
 } catch (err) {
 console.error(err.message);
res.status(500).send('Server Error');
 }
});

// @route   GET /api/cart
// @desc    Get all items in the user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
try {
const cartItems = await CartItem.findAll({
 where: { userId: req.user.id },
 include: [Product] // This is crucial - it joins the Product details
});
 res.json(cartItems);
} catch (err) {
 console.error(err.message);
 res.status(500).send('Server Error');
 }
});

// @route   DELETE /api/cart/:id
// @desc    Remove a single item from the cart
// @access  Private
router.delete('/:id', auth, async (req, res) => {
 try {
 const cartItem = await CartItem.findOne({
 where: {
 id: req.params.id,
userId: req.user.id // Security check: ensures the item belongs to the logged-in user
 }
 });

if (!cartItem) {
 return res.status(404).json({ msg: 'Cart item not found' });
 }

 await cartItem.destroy(); // This deletes the item from the database
 res.json({ msg: 'Cart item removed' });

 } catch (err) {
 console.error(err.message);
 res.status(500).send('Server Error');
 }
});

// ---------------------------------------------
// Quantity Update Route (Kept for Feature 2)
// ---------------------------------------------
// @route   PUT /api/cart/:id
// @desc    Update quantity of a single cart item
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { quantity } = req.body;
    
    if (quantity === undefined) {
        return res.status(400).json({ msg: 'Quantity field is required' });
    }

    try {
        const cartItem = await CartItem.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!cartItem) {
            return res.status(404).json({ msg: 'Cart item not found' });
        }
        
        // Validation: If quantity is 0 or less, destroy the item
        if (quantity <= 0) {
            await cartItem.destroy();
            return res.json({ msg: 'Item removed (quantity zeroed)' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.json(cartItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;