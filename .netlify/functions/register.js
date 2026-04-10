// netlify/functions/register.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Redis } = require('@upstash/redis');

// Initialize Redis (if URL and token are set in environment)
let redis = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('Redis connected');
  } else {
    console.log('Redis not configured, using in-memory storage');
  }
} catch (error) {
  console.error('Redis initialization error:', error);
}

// In-memory fallback storage (used when Redis is not available)
let inMemoryUsers = [];
let inMemoryProgress = [];
let inMemoryAttempts = [];

// Helper to get user by email
async function getUserByEmail(email) {
  if (redis) {
    const userId = await redis.hget('user_emails', email);
    if (!userId) return null;
    const userData = await redis.hget('users', userId);
    return userData ? JSON.parse(userData) : null;
  } else {
    return inMemoryUsers.find(u => u.email === email);
  }
}

// Helper to get user by ID
async function getUserById(id) {
  if (redis) {
    const userData = await redis.hget('users', id);
    return userData ? JSON.parse(userData) : null;
  } else {
    return inMemoryUsers.find(u => u.id === id);
  }
}

// Helper to save user
async function saveUser(user) {
  if (redis) {
    await redis.hset('users', { [user.id]: JSON.stringify(user) });
    await redis.hset('user_emails', { [user.email]: user.id });
  } else {
    inMemoryUsers.push(user);
  }
}

// Helper to save progress
async function saveProgress(userId, lessonId) {
  const progressKey = `progress:${userId}`;
  if (redis) {
    const current = await redis.get(progressKey) || [];
    if (!current.includes(lessonId)) {
      current.push(lessonId);
      await redis.set(progressKey, current);
    }
  } else {
    const existing = inMemoryProgress.find(p => p.userId === userId && p.lessonId === lessonId);
    if (!existing) {
      inMemoryProgress.push({ userId, lessonId, completed: true });
    }
  }
}

// Helper to save assessment attempt
async function saveAssessmentAttempt(userId, score, passed) {
  const attemptKey = `assessment:${userId}`;
  const attempt = { id: uuidv4(), score, passed, date: new Date().toISOString() };
  
  if (redis) {
    const attempts = await redis.get(attemptKey) || [];
    attempts.push(attempt);
    await redis.set(attemptKey, attempts);
  } else {
    if (!inMemoryAttempts.find(a => a.userId === userId)) {
      inMemoryAttempts.push({ userId, attempts: [] });
    }
    const userAttempts = inMemoryAttempts.find(a => a.userId === userId);
    if (userAttempts) {
      userAttempts.attempts.push(attempt);
    }
  }
}

// Main handler
exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Handle GET request (for testing)
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Registration API is working',
        redisConfigured: !!redis,
        timestamp: new Date().toISOString()
      })
    };
  }

  // Only allow POST requests for registration
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
    
    if (name.length < 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name must be at least 2 characters' })
      };
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Please enter a valid email address' })
      };
    }
    
    if (password.length < 6) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Password must be at least 6 characters' })
      };
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
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
    
    // Create user object
    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };
    
    // Save user to storage
    await saveUser(newUser);
    
    console.log('User created successfully:', userId);
    
    // Set session cookie
    const cookie = `session=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; Secure=${process.env.NODE_ENV === 'production'}`;
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Set-Cookie': cookie
      },
      body: JSON.stringify({
        success: true,
        redirect: redirect || '/foundation/dashboard',
        user: { id: userId, name, email }
      })
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error. Please try again later.' })
    };
  }
};