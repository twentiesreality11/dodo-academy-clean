// netlify/functions/register.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Simple in-memory storage (will reset on function restart)
let users = [];

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  // GET request - test if function is working
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Register function is working!',
        usersCount: users.length,
        timestamp: new Date().toISOString()
      })
    };
  }

  // Only POST for registration
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, password, redirect } = JSON.parse(event.body);
    
    console.log('Registration attempt:', { name, email });
    
    // Validation
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'All fields are required' })
      };
    }
    
    if (password.length < 6) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Password must be at least 6 characters' })
      };
    }
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email already registered' })
      };
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    // Store user
    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    
    console.log('User created:', userId);
    
    // Set cookie
    const cookie = `session=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; Secure=false`;
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Set-Cookie': cookie
      },
      body: JSON.stringify({
        success: true,
        redirect: redirect || '/foundation/dashboard'
      })
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};