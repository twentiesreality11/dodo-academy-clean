import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ user: null });
  }
  
  const user = getUserById(sessionId);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json({ user: userWithoutPassword });
}