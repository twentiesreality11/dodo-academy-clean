import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Progress saved in localStorage on client side
  return NextResponse.json({ success: true });
}