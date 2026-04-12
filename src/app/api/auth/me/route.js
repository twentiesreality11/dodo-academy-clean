import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

let users = [];

export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ user: null });
  }
  
  const user = users.find(u => u.id === sessionId);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json({ user: userWithoutPassword });
}