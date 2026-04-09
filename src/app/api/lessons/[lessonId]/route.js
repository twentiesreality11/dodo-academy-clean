import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    // Get lesson ID from params
    const lessonId = params.lessonId;
    
    console.log('Lesson ID requested:', lessonId);
    
    // Get database connection
    const sql = neon(process.env.POSTGRES_URL);
    
    // First, check if lessons exist
    const allLessons = await sql`SELECT id, title FROM lessons`;
    console.log('All lessons in DB:', allLessons);
    
    if (allLessons.length === 0) {
      return NextResponse.json(
        { error: 'No lessons found in database. Please run seed script.' },
        { status: 404 }
      );
    }
    
    // Get the specific lesson
    const lessons = await sql`
      SELECT * FROM lessons WHERE id = ${lessonId}
    `;
    
    if (!lessons || lessons.length === 0) {
      return NextResponse.json(
        { 
          error: `Lesson ${lessonId} not found`,
          availableLessons: allLessons.map(l => ({ id: l.id, title: l.title }))
        },
        { status: 404 }
      );
    }
    
    const lesson = lessons[0];
    
    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        order_num: lesson.order_num
      },
      completed: false
    });
    
  } catch (error) {
    console.error('Lesson API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}