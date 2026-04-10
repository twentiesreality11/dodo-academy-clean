// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';



export async function GET(request) {
  try {
    // Get session from cookie
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ user: null });
    }
    
    const user = await getUserById(sessionId);
    
    if (!user) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null });
  }
}