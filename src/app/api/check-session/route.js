import { NextResponse } from 'next/server';

export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  
  return NextResponse.json({ 
    hasSession: !!sessionId,
    sessionId: sessionId || null,
    cookies: request.headers.get('cookie') || 'none'
  });
}