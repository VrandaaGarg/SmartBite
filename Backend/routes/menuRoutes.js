const express = require('express');
const router = express.Router();
const { getAllMenus } = require('../controllers/menuController');

router.get('/', getAllMenus);

module.exports = router;
