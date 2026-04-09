import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = Redis.fromEnv();

// User keys
const USER_KEY = 'users';
const USER_EMAIL_INDEX = 'user_emails';

// Progress keys
const PROGRESS_PREFIX = 'progress:';
const ASSESSMENT_PREFIX = 'assessment:';

// Helper to get user by email (using Redis hash)
export async function getUserByEmail(email) {
  const userId = await redis.hget(USER_EMAIL_INDEX, email);
  if (!userId) return null;
  return await redis.hget(USER_KEY, userId);
}

// Helper to get user by ID
export async function getUserById(userId) {
  return await redis.hget(USER_KEY, userId);
}

// Create new user
export async function createUser(name, email, password) {
  // Check if user exists
  const existingUserId = await redis.hget(USER_EMAIL_INDEX, email);
  if (existingUserId) {
    throw new Error('Email already exists');
  }
  
  // Generate unique ID
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create user object (without storing password in plain text - hash it first)
  const user = {
    id: userId,
    name,
    email,
    password, // This should be hashed before calling this function
    created_at: new Date().toISOString()
  };
  
  // Store user
  await redis.hset(USER_KEY, { [userId]: JSON.stringify(user) });
  await redis.hset(USER_EMAIL_INDEX, { [email]: userId });
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Verify user login
export async function verifyUser(email, password, bcrypt) {
  const userId = await redis.hget(USER_EMAIL_INDEX, email);
  if (!userId) return null;
  
  const userData = await redis.hget(USER_KEY, userId);
  if (!userData) return null;
  
  const user = JSON.parse(userData);
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Get all lessons (from JSON file - static)
export async function getLessons() {
  // For lessons, we still read from JSON file since they're static
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'lessons.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.lessons || [];
}

// Get a single lesson
export async function getLessonById(id) {
  const lessons = await getLessons();
  return lessons.find(l => l.id === id);
}

// Get user's completed lessons
export async function getUserProgress(userId) {
  const progressKey = `${PROGRESS_PREFIX}${userId}`;
  const progress = await redis.get(progressKey);
  return progress || [];
}

// Mark lesson as complete
export async function markLessonComplete(userId, lessonId) {
  const progressKey = `${PROGRESS_PREFIX}${userId}`;
  const currentProgress = await redis.get(progressKey) || [];
  
  if (!currentProgress.includes(lessonId)) {
    currentProgress.push(lessonId);
    await redis.set(progressKey, currentProgress);
  }
  
  return true;
}

// Get assessment questions (static from JSON)
export async function getAssessmentQuestions() {
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'assessment.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.questions || [];
}

// Save assessment attempt
export async function saveAssessmentAttempt(userId, score, passed) {
  const assessmentKey = `${ASSESSMENT_PREFIX}${userId}`;
  const attempts = await redis.get(assessmentKey) || [];
  
  attempts.push({
    id: `attempt_${Date.now()}`,
    score,
    passed,
    date: new Date().toISOString()
  });
  
  await redis.set(assessmentKey, attempts);
  return true;
}

// Get user's assessment attempts
export async function getAssessmentAttempts(userId) {
  const assessmentKey = `${ASSESSMENT_PREFIX}${userId}`;
  return await redis.get(assessmentKey) || [];
}

// Store inquiry (for critical infrastructure form)
export async function saveInquiry(inquiry) {
  const inquiryKey = `inquiry_${Date.now()}`;
  await redis.set(inquiryKey, JSON.stringify(inquiry));
  return true;
}

// Helper to check if Redis is connected
export async function isRedisConnected() {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis connection error:', error);
    return false;
  }
}

export { redis };