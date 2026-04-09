import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { name, email, password, redirect } = await request.json();
    
    console.log('Registration attempt for:', email);
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    // Create user
    const user = await createUser(name, email, password);
    
    // Try to send welcome email (don't fail registration if email fails)
    try {
      await sendWelcomeEmail(name, email);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }
    
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    console.log('Registration successful for:', email);
    return response;
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: error.message || 'Registration failed' 
    }, { status: 400 });
  }
}