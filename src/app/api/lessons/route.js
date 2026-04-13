import { NextResponse } from 'next/server';
import { getLessons, getProgress, hasUserPaid } from '@/lib/db';

export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const hasPaid = await hasUserPaid(sessionId);
  const lessons = await getLessons();
  const progress = await getProgress(sessionId);
  
  const lessonsWithProgress = lessons.map(lesson => ({
    ...lesson,
    locked: !hasPaid,
    completed: progress.some(p => p.lesson_id === lesson.id && p.completed)
  }));
  
  return NextResponse.json({ lessons: lessonsWithProgress, hasPaid });
}