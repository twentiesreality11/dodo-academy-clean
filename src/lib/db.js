import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');
const lessonsFile = path.join(dataDir, 'lessons.json');
const progressFile = path.join(dataDir, 'progress.json');

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return {};
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

// Initialize files
if (!fs.existsSync(usersFile)) writeJSON(usersFile, { users: [] });
if (!fs.existsSync(progressFile)) writeJSON(progressFile, { progress: [] });

export function getUsers() {
  const data = readJSON(usersFile);
  return data.users || [];
}

export function getUserByEmail(email) {
  return getUsers().find(u => u.email === email);
}

export function getUserById(id) {
  return getUsers().find(u => u.id === id);
}

export async function createUser(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email)) throw new Error('Email already exists');
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), name, email, password: hashedPassword, created_at: new Date().toISOString() };
  
  users.push(newUser);
  writeJSON(usersFile, { users });
  
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function verifyUser(email, password) {
  const user = getUserByEmail(email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getLessons() {
  const data = readJSON(lessonsFile);
  return data.lessons || [];
}

export function getLessonById(id) {
  return getLessons().find(l => l.id === id);
}

export function getProgress(userId) {
  const data = readJSON(progressFile);
  return (data.progress || []).filter(p => p.user_id === userId);
}

export function markLessonComplete(userId, lessonId) {
  const data = readJSON(progressFile);
  if (!data.progress) data.progress = [];
  
  const existing = data.progress.find(p => p.user_id === userId && p.lesson_id === lessonId);
  if (existing) {
    existing.completed = true;
    existing.completed_at = new Date().toISOString();
  } else {
    data.progress.push({ user_id: userId, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() });
  }
  
  return writeJSON(progressFile, data);
}