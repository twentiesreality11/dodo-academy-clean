import { NextResponse } from 'next/server';
import { markLessonComplete, getUserById } from '@/lib/db';

export async function POST(request, { params }) {
  const sessionId = request.cookies.get('session')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const user = getUserById(sessionId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });
  
  markLessonComplete(user.id, params.lessonId);
  return NextResponse.json({ success: true });
}