import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if user has paid
    const payments = await sql`
      SELECT status FROM payments 
      WHERE user_id = ${sessionId} 
        AND course_type = 'foundation' 
        AND status = 'success'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    if (!payments || payments.length === 0) {
      return NextResponse.json(
        { error: 'Payment required. Please purchase the course.' },
        { status: 403 }
      );
    }
    
    const { lessonId } = params;
    
    // Get the lesson
    const lessons = await sql`
      SELECT * FROM lessons WHERE id = ${lessonId}
    `;
    
    if (!lessons || lessons.length === 0) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    const lesson = lessons[0];
    
    // Check if completed
    const progress = await sql`
      SELECT completed FROM progress 
      WHERE user_id = ${sessionId} AND lesson_id = ${lessonId}
    `;
    
    return NextResponse.json({
      lesson,
      completed: progress && progress.length > 0 ? progress[0].completed : false
    });
  } catch (error) {
    console.error('Lesson API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}