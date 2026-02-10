const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(async () => {
  if (process.env.NODE_ENV !== 'test') {
    const Service = require('./models/Service');
    const count = await Service.countDocuments();
    if (count === 0) {
      console.log('Seeding initial data...');
      const services = [
        {
          name: "Lumière Wellness",
          description: "Full Body Massage & Facial",
          rating: 4.9,
          reviews: 128,
          priceRange: "$$",
          price: "$120",
          image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
          alt: "Luxury spa interior with warm lighting and massage beds",
          badge: { text: "Best Seller", color: "bg-primary/90" },
          category: "Spa",
          serviceType: "Spa & Massage",
          priceValue: 120
        },
        {
          name: "Obsidian Salon",
          description: "Hair Styling & Color",
          rating: 4.7,
          reviews: 84,
          priceRange: "$$$",
          price: "$85",
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
          alt: "Modern hair salon interior with mirrors and salon chairs",
          category: "Hair",
          serviceType: "Hair Styling",
          priceValue: 85
        },
        {
          name: "Serenity Skin",
          description: "Dermatology & Care",
          rating: 5.0,
          reviews: 42,
          priceRange: "$$$$",
          price: "$200",
          image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop",
          alt: "Person receiving a facial treatment in a spa setting",
          category: "Wellness",
          serviceType: "Spa & Massage",
          priceValue: 200
        },
        {
          name: "Apex Fitness",
          description: "Personal Training",
          rating: 4.8,
          reviews: 210,
          priceRange: "$$",
          price: "$60",
          priceLabel: "Session",
          image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
          alt: "Gym equipment in a modern fitness center",
          category: "Fitness",
          serviceType: "Fitness Training",
          priceValue: 60
        },
        {
          name: "Aura Retreat",
          description: "Meditation & Yoga",
          rating: 4.5,
          reviews: 56,
          priceRange: "$",
          price: "$36",
          originalPrice: "$45",
          image: "https://images.unsplash.com/photo-1506126613408-07cace5e94b3?w=800&h=600&fit=crop",
          alt: "Relaxing spa atmosphere with candles and towels",
          badge: { text: "-20% Off", color: "bg-red-500/90" },
          category: "Wellness",
          serviceType: "Spa & Massage",
          priceValue: 36
        },
        {
          name: "Elegance Studio",
          description: "Makeup & Nails",
          rating: 4.6,
          reviews: 102,
          priceRange: "$$",
          price: "$55",
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
          alt: "Professional makeup artist brushes and tools",
          category: "Hair",
          serviceType: "Nail Care",
          priceValue: 55
        }
      ];
      await Service.insertMany(services);
      console.log('Data Seeded!');
    }
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Basic error handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    error: err
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
