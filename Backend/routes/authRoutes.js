const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { updateProfile } = require('../controllers/authController');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put("/update-profile", updateProfile);

module.exports = router;
