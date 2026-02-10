const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateFavorites,
  updateCart,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile);
router.route('/favorites').put(protect, updateFavorites);
router.route('/cart').put(protect, updateCart);

module.exports = router;
