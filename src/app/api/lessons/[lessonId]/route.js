import { NextResponse } from 'next/server';
import { getLessonById, getProgress, getUserById } from '@/lib/db';

export async function GET(request, { params }) {
  const sessionId = request.cookies.get('session')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const user = getUserById(sessionId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });
  
  const lesson = getLessonById(params.lessonId);
  if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  
  const progress = getProgress(user.id);
  const completed = progress.some(p => p.lesson_id === params.lessonId && p.completed);
  
  return NextResponse.json({ lesson, completed });
}