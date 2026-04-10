// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';



export async function POST(request) {
  try {
    const { email, password, redirect } = await request.json();
    
    console.log('Login attempt:', { email });
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('Login successful:', email);
    
    // Create response
    const response = NextResponse.json({
      success: true,
      redirect: redirect || '/foundation/dashboard'
    });
    
    // Set session cookie
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
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}