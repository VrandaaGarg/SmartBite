const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// @route   POST /api/cart
// @desc    Add item to cart (or increase quantity if exists)
router.post('/', cartController.addToCart);

// @route   GET /api/cart/:customerId
// @desc    Get all cart items for a customer
router.get('/:customerId', cartController.getCartByCustomer);

// @route   PUT /api/cart/update
// @desc    Update quantity of item in cart
router.put('/update', cartController.updateCartItem);

// @route   DELETE /api/cart/remove
// @desc    Remove specific item from cart
router.delete('/remove', cartController.removeCartItem);

// @route   DELETE /api/cart/clear/:customerId
// @desc    Clear cart for a customer
router.delete('/clear/:customerId', cartController.clearCart);

module.exports = router;
