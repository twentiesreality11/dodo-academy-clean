import bcrypt from 'bcryptjs';
import * as redisDb from './redis';

// Determine if we're using Redis (production) or local files (development)
const useRedis = process.env.UPSTASH_REDIS_REST_URL && process.env.NODE_ENV === 'production';

// Hash password helper
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// ============ USER OPERATIONS ============
export async function getUserByEmail(email) {
  if (useRedis) {
    return await redisDb.getUserByEmail(email);
  }
  // Fallback to local JSON (for development)
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'users.json');
  if (!fs.existsSync(dataPath)) return null;
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return (data.users || []).find(u => u.email === email);
}

export async function getUserById(id) {
  if (useRedis) {
    return await redisDb.getUserById(id);
  }
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'users.json');
  if (!fs.existsSync(dataPath)) return null;
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return (data.users || []).find(u => u.id === id);
}

export async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  if (useRedis) {
    return await redisDb.createUser(name, email, hashedPassword);
  }
  
  // Fallback to local JSON
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'users.json');
  let users = [];
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    users = data.users || [];
  }
  
  if (users.find(u => u.email === email)) {
    throw new Error('Email already exists');
  }
  
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify({ users }, null, 2));
  
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function verifyUser(email, password) {
  if (useRedis) {
    return await redisDb.verifyUser(email, password, bcrypt);
  }
  
  const user = await getUserByEmail(email);
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// ============ LESSON OPERATIONS ============
export async function getLessons() {
  if (useRedis) {
    return await redisDb.getLessons();
  }
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'lessons.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.lessons || [];
}

export async function getLessonById(id) {
  const lessons = await getLessons();
  return lessons.find(l => l.id === id);
}

// ============ PROGRESS OPERATIONS ============
export async function getProgress(userId) {
  if (useRedis) {
    return await redisDb.getUserProgress(userId);
  }
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'progress.json');
  if (!fs.existsSync(dataPath)) return [];
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return (data.progress || []).filter(p => p.user_id === userId).map(p => p.lesson_id);
}

export async function markLessonComplete(userId, lessonId) {
  if (useRedis) {
    return await redisDb.markLessonComplete(userId, lessonId);
  }
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'progress.json');
  let data = { progress: [] };
  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  
  const existing = data.progress.find(p => p.user_id === userId && p.lesson_id === lessonId);
  if (existing) {
    existing.completed = true;
  } else {
    data.progress.push({ user_id: userId, lesson_id: lessonId, completed: true });
  }
  
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  return true;
}

// ============ ASSESSMENT OPERATIONS ============
export async function getAssessmentQuestions() {
  if (useRedis) {
    return await redisDb.getAssessmentQuestions();
  }
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'assessment.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.questions || [];
}

export async function saveAssessmentAttempt(userId, score, passed) {
  if (useRedis) {
    return await redisDb.saveAssessmentAttempt(userId, score, passed);
  }
  // For local development, just return true
  return true;
}

// Alias for updateLessonProgress
export async function updateLessonProgress(userId, lessonId, completed) {
  if (completed) {
    return await markLessonComplete(userId, lessonId);
  }
  return true;
}

// Check if we're connected to Redis (for debugging)
export async function isDbConnected() {
  if (useRedis) {
    return await redisDb.isRedisConnected();
  }
  return true;
}