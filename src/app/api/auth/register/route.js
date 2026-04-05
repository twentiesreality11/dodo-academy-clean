import { createUser, setUserSession } from '@/lib/auth';
import { sendWelcomeEmail } from '@/utils/email';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password, redirect } = await request.json();
    
    // Validate
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    // Create user
    const user = await createUser(name, email, password);
    
    // Send welcome email to the user's email address
    const emailSent = await sendWelcomeEmail(email, name);
    
    if (!emailSent) {
      console.warn(`Welcome email failed for ${email} but user was created`);
    }
    
    // Set session and redirect
    await setUserSession(user.id);
    
    return NextResponse.json({ 
      success: true, 
      redirect: redirect || '/foundation/dashboard' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}