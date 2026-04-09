import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password, redirect } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    
    const user = await verifyUser(email, password);
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    
    const response = NextResponse.json({ success: true, redirect: redirect || '/foundation/dashboard' });
    response.cookies.set('session', user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 604800 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}