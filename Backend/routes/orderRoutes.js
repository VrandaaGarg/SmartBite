const express = require('express');
const router = express.Router();
const { placeOrder, getOrdersByCustomer } = require('../controllers/orderController');

// ✅ Place order
router.post("/place", placeOrder);

// ✅ Get orders by customer ID with clean URL
router.get("/customer/:customerId", getOrdersByCustomer);

module.exports = router;
