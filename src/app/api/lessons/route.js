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
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if user has access (payment record)
    const payment = await sql`
      SELECT status FROM payments 
      WHERE user_id = ${sessionId} 
        AND course_type = 'foundation' 
        AND status = 'success'
      LIMIT 1
    `;
    
    const hasAccess = payment && payment.length > 0;
    console.log('User has access:', hasAccess);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Payment required' }, 
        { status: 403 }
      );
    }
    
    // Get lessons with progress
    const lessons = await sql`
      SELECT l.*, 
        COALESCE(p.completed, false) as completed
      FROM lessons l
      LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ${sessionId}
      ORDER BY l.order_num
    `;
    
    console.log(`Returning ${lessons.length} lessons`);
    
    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}