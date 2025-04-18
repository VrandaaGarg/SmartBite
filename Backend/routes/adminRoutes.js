const express = require('express');
const router = express.Router();
const {
  getAllDishes,
  addDish,
  updateDish,
  deleteDish,
  getAllOrders,
  getAllCustomers
} = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Protect all admin routes
router.use(verifyToken, verifyAdmin);

router.get('/dishes', getAllDishes);
router.post('/dishes/add', addDish);
router.put('/dishes/:id', updateDish);
router.delete('/dishes/:id', deleteDish);

router.get('/orders', getAllOrders);
router.get('/customers', getAllCustomers);

module.exports = router;
