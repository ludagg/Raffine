const mongoose = require('mongoose');
const Service = require('./models/Service');
const seedData = require('./data/services.json');
require('dotenv').config();

const seedDB = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI;
    if (!dbUrl) {
      console.error('MONGODB_URI is required for seeding.');
      process.exit(1);
    }

    await mongoose.connect(dbUrl);
    console.log('MongoDB Connected for seeding...');

    await Service.deleteMany();
    await Service.insertMany(seedData);

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
