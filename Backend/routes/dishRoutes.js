const express = require('express');
const router = express.Router();
const { getAllDishes } = require('../controllers/dishController');

router.get('/', getAllDishes);

module.exports = router;
