const express = require('express');
const router = express.Router();
const {
  addReview,
  getReviewsForDish,
  getReviewsByCustomer,
  updateReview
} = require('../controllers/reviewController');

// Update review by CustomerID & DishID
router.put('/update', updateReview); // HTTP PUT for updates


// Add a review
router.post('/add', addReview);

// Get all reviews for a specific dish
router.get('/dish/:dishId', getReviewsForDish);

// Get all reviews by a specific customer
router.get('/customer/:customerId', getReviewsByCustomer);

module.exports = router;
