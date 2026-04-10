import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
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
    
    // Get all lessons with progress
    const lessons = await sql`
      SELECT l.*, 
        CASE WHEN p.completed = true THEN true ELSE false END as completed
      FROM lessons l
      LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ${sessionId}
      ORDER BY l.order_num
    `;
    
    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}