const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites').populate('cart.service');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.favorites,
      cart: user.cart,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user favorites
// @route   PUT /api/users/favorites
// @access  Private
const updateFavorites = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.favorites = req.body.favorites || user.favorites;
    const updatedUser = await user.save();
    const populatedUser = await updatedUser.populate('favorites');
    res.json({
      favorites: populatedUser.favorites,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user cart
// @route   PUT /api/users/cart
// @access  Private
const updateCart = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.cart = req.body.cart || user.cart;
    const updatedUser = await user.save();
    const populatedUser = await updatedUser.populate('cart.service');
    res.json({
      cart: populatedUser.cart,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  getUserProfile,
  updateFavorites,
  updateCart,
};
