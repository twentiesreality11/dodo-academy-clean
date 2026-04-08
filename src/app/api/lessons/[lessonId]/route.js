import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Get user from session (simplified)
async function getUserFromSession(request) {
  const cookies = request.headers.get('cookie');
  if (!cookies) return null;
  
  const sessionMatch = cookies.match(/session=([^;]+)/);
  if (!sessionMatch) return null;
  
  const sessionId = sessionMatch[1];
  
  const sql = neon(process.env.POSTGRES_URL);
  const users = await sql`
    SELECT id, name, email FROM users WHERE id = ${sessionId}
  `;
  
  return users[0] || null;
}

export async function GET(request, { params }) {
  try {
    // Get the lesson ID from params
    const { lessonId } = params;
    
    console.log('Lesson ID requested:', lessonId);
    
    // Check if user is authenticated
    const user = await getUserFromSession(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('User:', user.email);
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if user has paid
    const payments = await sql`
      SELECT status FROM payments 
      WHERE user_id = ${user.id} 
        AND course_type = 'foundation' 
        AND status = 'success'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    if (!payments || payments.length === 0) {
      return NextResponse.json(
        { error: 'Access denied. Please purchase the course.' },
        { status: 403 }
      );
    }
    
    // Get the lesson
    const lessons = await sql`
      SELECT * FROM lessons WHERE id = ${lessonId}
    `;
    
    if (!lessons || lessons.length === 0) {
      console.log('Lesson not found:', lessonId);
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    const lesson = lessons[0];
    console.log('Lesson found:', lesson.title);
    
    // Check if completed
    const progress = await sql`
      SELECT completed FROM progress 
      WHERE user_id = ${user.id} AND lesson_id = ${lessonId}
    `;
    
    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        order_num: lesson.order_num
      },
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