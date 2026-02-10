const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not defined in .env file. Using a default for development only.');
  process.env.JWT_SECRET = 'default_secret_for_dev_only';
}

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));

// Basic route
app.get('/', (req, res) => {
  res.send('Raffine API with MongoDB is running...');
});

// Database connection
const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGODB_URI;

    if (!dbUrl) {
      console.log('No MONGODB_URI found, starting MongoMemoryServer...');
      const mongoServer = await MongoMemoryServer.create();
      dbUrl = mongoServer.getUri();
      console.log('MongoMemoryServer started at:', dbUrl);
    }

    await mongoose.connect(dbUrl);
    console.log('MongoDB Connected...');

    // Seed data if needed
    const Service = require('./models/Service');
    const count = await Service.countDocuments();
    if (count === 0) {
      console.log('Seeding initial data...');
      const seedData = require('./data/services.json');
      await Service.insertMany(seedData);
      console.log('Data seeded successfully');
    }

  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
