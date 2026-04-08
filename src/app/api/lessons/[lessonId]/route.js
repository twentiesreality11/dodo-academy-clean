export const dynamic = 'force-dynamic';

import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const db = await getDb();
    const { lessonId } = params;
    
    // Check if user has paid
    const payment = await db.get(
      `SELECT status FROM payments 
       WHERE user_id = ? AND course_type = 'foundation' AND status = 'success'
       ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    const lesson = await db.get(
      'SELECT * FROM lessons WHERE id = ?',
      [lessonId]
    );
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    const progress = await db.get(
      'SELECT completed FROM progress WHERE user_id = ? AND lesson_id = ?',
      [user.id, lessonId]
    );
    
    return NextResponse.json({
      lesson,
      completed: progress ? progress.completed : false
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}