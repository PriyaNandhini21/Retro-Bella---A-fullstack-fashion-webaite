const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const WishlistItem = require('../models/wishlistItem');
const Product = require('../models/product');

// @route   POST /api/wishlist
// @desc    Add an item to the wishlist
// @access  Private
router.post('/', auth, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        // Check if the item is already in the user's wishlist
        const existingItem = await WishlistItem.findOne({ where: { userId, productId } });
        if (existingItem) {
            return res.status(400).json({ msg: 'Item already in wishlist' });
        }

        // Add the new item to the wishlist
        const wishlistItem = await WishlistItem.create({
            userId,
            productId,
        });
        res.status(201).json(wishlistItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/wishlist
// @desc    Get all items in the user's wishlist
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const wishlistItems = await WishlistItem.findAll({
            where: { userId: req.user.id },
            include: [Product] // Joins the Product details
        });
        res.json(wishlistItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/wishlist/:id
// @desc    Remove an item from the wishlist
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const wishlistItem = await WishlistItem.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id // Security check
            }
        });

        if (!wishlistItem) {
            return res.status(404).json({ msg: 'Wishlist item not found' });
        }

        await wishlistItem.destroy();
        res.json({ msg: 'Wishlist item removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;