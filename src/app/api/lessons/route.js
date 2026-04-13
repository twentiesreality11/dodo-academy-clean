import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    console.log('Lessons API - Session:', sessionId);
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!process.env.POSTGRES_URL) {
      console.log('No POSTGRES_URL');
      return NextResponse.json({ lessons: [], hasPaid: false });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if user has paid
    let hasPaid = false;
    try {
      const payments = await sql`
        SELECT status FROM payments 
        WHERE user_id = ${sessionId} AND status = 'success' AND course_type = 'foundation'
        LIMIT 1
      `;
      hasPaid = payments.length > 0;
    } catch (err) {
      console.log('Payment check error:', err.message);
    }
    
    // Get lessons with progress
    let lessons = [];
    try {
      lessons = await sql`
        SELECT l.*, 
          COALESCE(p.completed, false) as completed
        FROM lessons l
        LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ${sessionId}
        ORDER BY l.order_num
      `;
    } catch (err) {
      console.log('Lessons fetch error:', err.message);
      // Return empty lessons array if table doesn't exist yet
      lessons = [];
    }
    
    const lessonsWithLock = lessons.map(lesson => ({
      ...lesson,
      locked: !hasPaid
    }));
    
    return NextResponse.json({ lessons: lessonsWithLock, hasPaid });
    
  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json({ lessons: [], hasPaid: false });
  }
}