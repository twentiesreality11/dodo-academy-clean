import { loginUser, setUserSession } from '@/lib/auth';
import { NextResponse } from 'next/server';


export async function POST(request) {
  try {
    const { email, password, redirect } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const user = await loginUser(email, password);
    await setUserSession(user.id);
    
    return NextResponse.json({ 
      success: true, 
      redirect: redirect || '/foundation/dashboard' 
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}