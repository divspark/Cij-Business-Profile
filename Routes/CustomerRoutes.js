// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  showProfile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../Controller/CustomerController');
const customerAuthMiddleware = require('../middleware/customerAuth');

// Define routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', customerAuthMiddleware, showProfile);
router.put('/profile', customerAuthMiddleware, updateProfile);
router.delete('/profile', customerAuthMiddleware, deleteProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/update-password', customerAuthMiddleware, updatePassword);

module.exports = router;