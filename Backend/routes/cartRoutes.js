const express = require('express');
const router = express.Router();
const { addToCart, getCartByCustomer } = require('../controllers/cartController');

router.post('/add', addToCart);
router.get('/:customerId', getCartByCustomer);

module.exports = router;
