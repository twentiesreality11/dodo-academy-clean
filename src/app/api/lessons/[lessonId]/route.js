import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { lessonId } = params;
    
    if (!process.env.POSTGRES_URL) {
      // Mock lesson for testing
      return NextResponse.json({
        lesson: {
          id: lessonId,
          title: 'Lesson ' + lessonId,
          content: '<div class="lesson-content"><h2>Lesson Content</h2><p>This is a sample lesson.</p></div>'
        },
        completed: false
      });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    const lessons = await sql`
      SELECT * FROM lessons WHERE id = ${lessonId}
    `;
    
    if (!lessons || lessons.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}