const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');

router.post('/add', addReview);

module.exports = router;
