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
} = require('../Controller/CompanyController');

const authMiddleware = require('../middleware/CompanyAuth');

// Apply middleware to the routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, showProfile);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/profile', authMiddleware, deleteProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/update-password', authMiddleware, updatePassword);

module.exports = router;
