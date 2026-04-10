import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Fallback lessons in case database is not available
const FALLBACK_LESSONS = [
  { id: '1', title: 'Introduction to Cybersecurity', content: '<h2>Introduction to Cybersecurity</h2><p>Welcome to the course!</p>', order_num: 1 },
  { id: '2', title: 'Network Security Fundamentals', content: '<h2>Network Security</h2><p>Learn about network protection.</p>', order_num: 2 },
  { id: '3', title: 'Cryptography Basics', content: '<h2>Cryptography</h2><p>Understanding encryption and hashing.</p>', order_num: 3 },
  { id: '4', title: 'Ethical Hacking Basics', content: '<h2>Ethical Hacking</h2><p>Think like an attacker to defend.</p>', order_num: 4 },
  { id: '5', title: 'Final Assessment', content: '<h2>Final Assessment</h2><p>Test your knowledge.</p>', order_num: 5 },
];

export async function GET(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // If no database, return fallback lessons
    if (!process.env.POSTGRES_URL) {
      console.log('No POSTGRES_URL, using fallback lessons');
      return NextResponse.json({ lessons: FALLBACK_LESSONS });
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
        { error: 'Payment required' },
        { status: 403 }
      );
    }
    
    // Get lessons
    let lessons;
    try {
      lessons = await sql`
        SELECT l.*, 
          CASE WHEN p.completed = true THEN true ELSE false END as completed
        FROM lessons l
        LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ${sessionId}
        ORDER BY l.order_num
      `;
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError);
      lessons = FALLBACK_LESSONS;
    }
    
    return NextResponse.json({ lessons: lessons || FALLBACK_LESSONS });
  } catch (error) {
    console.error('Lessons API error:', error);
    // Return fallback lessons instead of error
    return NextResponse.json({ lessons: FALLBACK_LESSONS });
  }
}