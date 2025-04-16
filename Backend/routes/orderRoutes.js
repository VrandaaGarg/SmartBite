const express = require('express');
const router = express.Router();
const { placeOrder,getOrdersByCustomer } = require('../controllers/orderController');

router.post("/place", placeOrder);
router.get("/:customerId", getOrdersByCustomer);

module.exports = router;
