import { NextResponse } from 'next/server';
import { getLessons, getProgress, getUserById } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';



export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const user = getUserById(sessionId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });
  
  const lessons = getLessons();
  const progress = getProgress(user.id);
  const lessonsWithProgress = lessons.map(lesson => ({ ...lesson, completed: progress.some(p => p.lesson_id === lesson.id && p.completed) }));
  
  return NextResponse.json({ lessons: lessonsWithProgress });
}