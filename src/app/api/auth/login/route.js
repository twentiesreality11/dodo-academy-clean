import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Shared users array (same as register)
let users = [];

export async function POST(request) {
  try {
    const { email, password, redirect } = await request.json();
    
    console.log('Login attempt:', { email });
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password for:', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    console.log('Login successful:', email);
    
    const redirectUrl = redirect || '/foundation/dashboard';
    const response = NextResponse.json({ 
      success: true, 
      redirect: redirectUrl 
    });
    
    response.cookies.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}