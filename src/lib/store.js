// Simple file-based storage that persists across API routes
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({ users: [] }, null, 2));
}

// Read users from file
export function getUsers() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data).users || [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Write users to file
export function saveUsers(users) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify({ users }, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

// Get user by email
export function getUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email === email);
}

// Get user by ID
export function getUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id);
}

// Create user
export function createUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}