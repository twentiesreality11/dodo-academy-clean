import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// In-memory storage (resets on server restart - for demo only)
let users = [];

export async function POST(request) {
  try {
    const { name, email, password, redirect } = await request.json();
    
    console.log('Registration attempt:', { name, email });
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    
    // Create user
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    users.push({
      id: userId,
      name,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString()
    });
    
    console.log('User created:', userId);
    
    const response = NextResponse.json({ 
      success: true, 
      redirect: redirect || '/foundation/dashboard' 
    });
    
    response.cookies.set('session', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    
    return response;
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}