import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    console.log('Lessons API called, session:', sessionId ? 'present' : 'missing');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check database connection
    if (!process.env.POSTGRES_URL) {
      console.error('POSTGRES_URL not configured');
      // Return mock data for testing
      return NextResponse.json({ 
        lessons: [
          { id: '1', title: 'Introduction to Cybersecurity', completed: false, locked: true, order_num: 1 },
          { id: '2', title: 'Network Security Fundamentals', completed: false, locked: true, order_num: 2 },
          { id: '3', title: 'Cryptography Basics', completed: false, locked: true, order_num: 3 },
          { id: '4', title: 'Ethical Hacking Basics', completed: false, locked: true, order_num: 4 },
          { id: '5', title: 'Final Assessment', completed: false, locked: true, order_num: 5 },
        ],
        hasPaid: false
      });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Test database connection first
    try {
      const test = await sql`SELECT 1 as connected`;
      console.log('Database connected:', test[0]?.connected === 1);
    } catch (dbError) {
      console.error('Database connection test failed:', dbError.message);
      return NextResponse.json({ 
        lessons: [],
        hasPaid: false,
        error: 'Database connection failed'
      }, { status: 500 });
    }
    
    // Check if user has paid
    let hasPaid = false;
    try {
      const payments = await sql`
        SELECT status FROM payments 
        WHERE user_id = ${sessionId} AND status = 'success' AND course_type = 'foundation'
        LIMIT 1
      `;
      hasPaid = payments && payments.length > 0;
      console.log('User has paid:', hasPaid);
    } catch (err) {
      console.log('Payment check error:', err.message);
    }
    
    // Get lessons
    let lessons = [];
    try {
      lessons = await sql`
        SELECT l.*, 
          COALESCE(p.completed, false) as completed
        FROM lessons l
        LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ${sessionId}
        ORDER BY l.order_num
      `;
      console.log(`Found ${lessons.length} lessons`);
    } catch (err) {
      console.log('Lessons fetch error:', err.message);
      // Return mock lessons if table doesn't exist
      lessons = [
        { id: '1', title: 'Introduction to Cybersecurity', completed: false, order_num: 1 },
        { id: '2', title: 'Network Security Fundamentals', completed: false, order_num: 2 },
        { id: '3', title: 'Cryptography Basics', completed: false, order_num: 3 },
        { id: '4', title: 'Ethical Hacking Basics', completed: false, order_num: 4 },
        { id: '5', title: 'Final Assessment', completed: false, order_num: 5 },
      ];
    }
    
    const lessonsWithLock = lessons.map(lesson => ({
      ...lesson,
      locked: !hasPaid
    }));
    
    return NextResponse.json({ lessons: lessonsWithLock, hasPaid });
    
  } catch (error) {
    console.error('Lessons API error:', error);
    // Return empty array instead of error to prevent UI crash
    return NextResponse.json({ 
      lessons: [],
      hasPaid: false,
      error: error.message 
    });
  }
}