import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await requireAuth();
    const db = await getDb();
    
    // Check if user has paid
    const payment = await db.get(
      `SELECT status FROM payments 
       WHERE user_id = ? AND course_type = 'foundation' AND status = 'success'
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
    const lessons = await db.all(
      `SELECT l.*, 
       CASE WHEN p.completed = 1 THEN true ELSE false END as completed
       FROM lessons l
       LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
       ORDER BY l.order_num`,
      [user.id]
    );
    
    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}