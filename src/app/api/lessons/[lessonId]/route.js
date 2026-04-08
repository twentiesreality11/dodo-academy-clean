import { requireAuth } from '@/lib/auth';
import { getOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const { lessonId } = params;
    
    console.log('Fetching lesson:', lessonId, 'for user:', user.id);
    
    // Check if user has paid
    const payment = await getOne(
      `SELECT status FROM payments 
       WHERE user_id = $1 AND course_type = 'foundation' AND status = 'success'
       ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );
    
    if (!payment) {
      console.log('User has not paid');
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Get the specific lesson
    const lesson = await getOne(
      'SELECT * FROM lessons WHERE id = $1',
      [lessonId]
    );
    
    if (!lesson) {
      console.log('Lesson not found:', lessonId);
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Check if lesson is completed
    const progress = await getOne(
      'SELECT completed FROM progress WHERE user_id = $1 AND lesson_id = $2',
      [user.id, lessonId]
    );
    
    console.log('Lesson found:', lesson.title);
    
    return NextResponse.json({
      lesson,
      completed: progress ? progress.completed : false
    });
  } catch (error) {
    console.error('Lesson API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}