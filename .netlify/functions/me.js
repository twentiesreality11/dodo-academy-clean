// netlify/functions/me.js
const { Redis } = require('@upstash/redis');

let redis = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.error('Redis initialization error:', error);
}

let inMemoryUsers = [];

async function getUserById(id) {
  if (redis) {
    const userData = await redis.hget('users', id);
    return userData ? JSON.parse(userData) : null;
  } else {
    return inMemoryUsers.find(u => u.id === id);
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const cookies = event.headers.cookie || '';
    const sessionMatch = cookies.match(/session=([^;]+)/);
    
    if (!sessionMatch) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ user: null })
      };
    }
    
    const sessionId = sessionMatch[1];
    const user = await getUserById(sessionId);
    
    if (!user) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ user: null })
      };
    }
    
    const { password, ...userWithoutPassword } = user;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ user: userWithoutPassword })
    };
    
  } catch (error) {
    console.error('Me error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};