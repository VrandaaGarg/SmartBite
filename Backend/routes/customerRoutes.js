const express = require('express');
const router = express.Router();
const { getAllCustomers } = require('../controllers/customerController');

router.get('/', getAllCustomers);

module.exports = router;
// This code defines a route for fetching all customers from the database.