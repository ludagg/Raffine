const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('raffine_user'));
  const headers = {
    'Content-Type': 'application/json',
  };
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }
  return headers;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
};

export const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  return response.json();
};

export const getServices = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/services?${query}`);
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
};

export const getUserProfile = async () => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const updateFavorites = async (favorites) => {
  const response = await fetch(`${API_URL}/users/favorites`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ favorites }),
  });
  if (!response.ok) throw new Error('Failed to update favorites');
  return response.json();
};

export const updateCart = async (cart) => {
  const response = await fetch(`${API_URL}/users/cart`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ cart }),
  });
  if (!response.ok) throw new Error('Failed to update cart');
  return response.json();
};
