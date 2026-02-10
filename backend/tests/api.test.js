const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Service = require('../models/Service');

let token;
let serviceId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await new Promise(resolve => {
      mongoose.connection.on('connected', resolve);
    });
  } else if (mongoose.connection.readyState === 2) {
    await new Promise(resolve => {
      mongoose.connection.on('connected', resolve);
    });
  }

  // Seed a service for testing
  const service = await Service.create({
    name: "Test Service",
    description: "Test Description",
    rating: 4.5,
    reviews: 10,
    price: "$100",
    image: "test.jpg",
    category: "Spa",
    serviceType: "Massage",
    priceValue: 100
  });
  serviceId = service._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should login an existing user', async () => {
    // We need a stable user for login test or use the one from register
    // Let's create another one just in case
    const email = `login-${Date.now()}@example.com`;
    await User.create({
        name: 'Login User',
        email: email,
        password: 'password123'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: email,
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Service Endpoints', () => {
  it('should get all services', async () => {
    const res = await request(app).get('/api/services');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get service by ID', async () => {
    const res = await request(app).get(`/api/services/${serviceId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Test Service");
  });
});

describe('User Endpoints (Protected)', () => {
  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email');
  });

  it('should update user favorites', async () => {
    const res = await request(app)
      .put('/api/users/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ favorites: [serviceId] });
    if (res.statusCode !== 200) {
      console.log('Update favorites error:', res.body);
    }
    expect(res.statusCode).toEqual(200);
    expect(res.body.favorites.length).toBe(1);
    expect(res.body.favorites[0]._id.toString()).toBe(serviceId.toString());
  });

  it('should update user cart', async () => {
    const res = await request(app)
      .put('/api/users/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ cart: [{ service: serviceId, quantity: 2 }] });
    if (res.statusCode !== 200) {
      console.log('Update cart error:', res.body);
    }
    expect(res.statusCode).toEqual(200);
    expect(res.body.cart.length).toBe(1);
    expect(res.body.cart[0].quantity).toBe(2);
    expect(res.body.cart[0].service._id.toString()).toBe(serviceId.toString());
  });
});
