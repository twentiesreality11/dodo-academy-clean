import { requireAuth } from '@/lib/auth';
import { getAll, getOne } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await requireAuth();
    
    // Check if user has paid
    const payment = await getOne(
      `SELECT status FROM payments 
       WHERE user_id = $1 AND course_type = 'foundation' AND status = 'success'
       ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Access denied. Please purchase the course.' },
        { status: 403 }
      );
    }
    
    // Get lessons with progress
    const lessons = await getAll(
      `SELECT l.*, 
       COALESCE(p.completed, false) as completed
       FROM lessons l
       LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = $1
       ORDER BY l.order_num`,
      [user.id]
    );
    
    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}