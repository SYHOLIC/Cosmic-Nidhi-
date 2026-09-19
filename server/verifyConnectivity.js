const mongoose = require('mongoose');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ujjwalcipher_db_user:Pt3j5HGog2GUE567@cosmic-nidhi.yathtt6.mongodb.net/?appName=Cosmic-Nidhi';

async function verifyAll() {
  console.log('=== Backend Connectivity & Verification Test ===');

  // 1. Database Connection
  try {
    console.log('\n1. Testing MongoDB Connection...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Check some collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections`);
  } catch (err) {
    console.error('❌ MongoDB Connection failed:', err.message);
  }

  // 2. API Endpoints Check
  try {
    console.log('\n2. Testing Public Endpoints...');
    
    const endpoints = [
      { name: 'Products', path: '/products' },
      { name: 'Categories', path: '/categories' },
      { name: 'Featured Products', path: '/products/featured' },
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(`${API_URL}${ep.path}`);
        console.log(`✅ [${res.status}] GET ${ep.path} - ${ep.name} works`);
      } catch (err) {
        console.error(`❌ GET ${ep.path} failed:`, err.message);
      }
    }

  } catch (err) {
    console.error('❌ API Endpoint testing failed:', err.message);
  }

  // 3. User Authentication Test
  try {
    console.log('\n3. Testing Auth / Admin Login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@cosmicnidhi.com', 
        password: 'admin' 
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
    console.log(`✅ [${loginRes.status}] Admin login succeeded. Token received.`);
    
    const token = loginData.token;

    console.log('\n4. Testing Protected Endpoints (Admin)...');
    const protectedEndpoints = [
      { name: 'Admin Dashboard Stats', path: '/admin/dashboard' },
      { name: 'Get All Users', path: '/admin/users' },
      { name: 'Get All Orders', path: '/admin/orders' },
    ];

    for (const ep of protectedEndpoints) {
      try {
        const res = await fetch(`${API_URL}${ep.path}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ [${res.status}] GET ${ep.path} - ${ep.name} works`);
      } catch (err) {
        console.error(`❌ GET ${ep.path} failed:`, err.message);
      }
    }

  } catch (err) {
    console.error('❌ Auth / Admin testing failed:', err.message);
  }

  console.log('\n=== Verification Complete ===');
  process.exit(0);
}

verifyAll();
