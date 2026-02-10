const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  id: Number, // Keeping the ID for compatibility with frontend
  name: {
    type: String,
    required: true
  },
  description: String,
  rating: Number,
  reviews: Number,
  priceRange: String,
  price: String,
  image: String,
  alt: String,
  badge: {
    text: String,
    color: String
  },
  category: String,
  serviceType: String,
  priceValue: Number,
  priceLabel: String
});

module.exports = mongoose.model('Service', ServiceSchema);
