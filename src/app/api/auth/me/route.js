import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/db';

export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  if (!sessionId) return NextResponse.json({ user: null });
  
  const user = getUserById(sessionId);
  if (!user) return NextResponse.json({ user: null });
  
  return NextResponse.json({ user });
}