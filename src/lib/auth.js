import { getDb } from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE = 'session';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  console.log('Password hashed successfully'); // Debug log
  return hashed;
}

export async function verifyPassword(password, hash) {
  console.log('Verifying password...'); // Debug log
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password valid:', isValid); // Debug log
  return isValid;
}

export async function createUser(name, email, password) {
  const db = await getDb();
  const id = uuidv4();
  const hashedPassword = await hashPassword(password);
  
  console.log('Creating user with hashed password:', hashedPassword.substring(0, 20) + '...'); // Debug log
  
  try {
    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    await db.run(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [id, name, email, hashedPassword]
    );
    
    console.log('User inserted successfully'); // Debug log
    return { id, name, email };
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  const db = await getDb();
  console.log('Login attempt for email:', email); // Debug log
  
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  
  if (!user) {
    console.log('User not found'); // Debug log
    throw new Error('Invalid email or password');
  }
  
  console.log('User found, verifying password...'); // Debug log
  console.log('Stored hash:', user.password.substring(0, 20) + '...'); // Debug log
  
  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    console.log('Password invalid'); // Debug log
    throw new Error('Invalid email or password');
  }
  
  console.log('Login successful'); // Debug log
  return { id: user.id, name: user.name, email: user.email };
}

export async function getUser() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!sessionId) return null;
  
  const db = await getDb();
  const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [sessionId]);
  
  return user;
}

export async function setUserSession(userId) {
  cookies().set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function logoutUser() {
  cookies().delete(SESSION_COOKIE);
  redirect('/');
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}