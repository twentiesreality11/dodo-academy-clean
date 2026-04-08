import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

export async function GET(request) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
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
    
    // Get all lessons with progress
    const lessons = await sql`
      SELECT l.*, 
        CASE WHEN p.completed = true THEN true ELSE false END as completed
      FROM lessons l
      LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ${user.id}
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