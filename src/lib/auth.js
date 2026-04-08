import { getOne, execute } from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE = 'session';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createUser(name, email, password) {
  const id = uuidv4();
  const hashedPassword = await hashPassword(password);
  
  try {
    // Check if user already exists
    const existingUser = await getOne('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser && existingUser.id) {
      throw new Error('Email already exists');
    }
    
    const result = await execute(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)',
      [id, name, email, hashedPassword]
    );
    
    console.log('User created successfully:', { id, name, email });
    return { id, name, email };
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  const user = await getOne('SELECT * FROM users WHERE email = $1', [email]);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }
  
  return { id: user.id, name: user.name, email: user.email };
}

export async function getUser() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!sessionId) return null;
  
  const user = await getOne('SELECT id, name, email FROM users WHERE id = $1', [sessionId]);
  return user;
}

export async function setUserSession(userId) {
  cookies().set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
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