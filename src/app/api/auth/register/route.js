import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { name, email, password, redirect } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    const user = await createUser(name, email, password);
    
    // Send welcome email (don't block registration if email fails)
    try {
      await sendWelcomeEmail(name, email);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Continue with registration even if email fails
    }
    
    const response = NextResponse.json({ 
      success: true, 
      redirect: redirect || '/foundation/dashboard' 
    });
    
    response.cookies.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800,
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}