const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: {
      type: Number,
      required: true,
      default: 0,
    },
    priceRange: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: String,
    },
    priceLabel: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
    },
    badge: {
      text: String,
      color: String,
    },
    category: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    priceValue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
