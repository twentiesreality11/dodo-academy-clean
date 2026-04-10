// src/lib/db.js
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Use Neon database (set up in Vercel Storage)
const sql = neon(process.env.POSTGRES_URL);

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Get user by email
export async function getUserByEmail(email) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('getUserByEmail error:', error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id) {
  try {
    const result = await sql`
      SELECT id, name, email, created_at FROM users WHERE id = ${id}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('getUserById error:', error);
    return null;
  }
}

// Create new user
export async function createUser(name, email, password) {
  try {
    const hashedPassword = await hashPassword(password);
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await sql`
      INSERT INTO users (id, name, email, password, created_at)
      VALUES (${id}, ${name}, ${email}, ${hashedPassword}, ${now})
    `;
    
    return { id, name, email, created_at: now };
  } catch (error) {
    console.error('createUser error:', error);
    throw new Error('Email already exists or database error');
  }
}

// Get lessons (static from data file)
export async function getLessons() {
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'data', 'lessons.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.lessons || [];
}

// Get lesson by ID
export async function getLessonById(id) {
  const lessons = await getLessons();
  return lessons.find(l => l.id === id);
}

// Get user's completed lessons
export async function getUserProgress(userId) {
  try {
    const result = await sql`
      SELECT lesson_id FROM progress WHERE user_id = ${userId} AND completed = true
    `;
    return result.map(r => r.lesson_id);
  } catch (error) {
    console.error('getUserProgress error:', error);
    return [];
  }
}

// Mark lesson as complete
export async function markLessonComplete(userId, lessonId) {
  try {
    await sql`
      INSERT INTO progress (user_id, lesson_id, completed, completed_at)
      VALUES (${userId}, ${lessonId}, true, ${new Date().toISOString()})
      ON CONFLICT (user_id, lesson_id) 
      DO UPDATE SET completed = true, completed_at = ${new Date().toISOString()}
    `;
    return true;
  } catch (error) {
    console.error('markLessonComplete error:', error);
    return false;
  }
}