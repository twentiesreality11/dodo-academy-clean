import { requireAuth } from '@/lib/auth';
import { getAll, getOne, execute } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendBadgeEmail } from '@/utils/email';

export async function POST(request, { params }) {
  try {
    const user = await requireAuth();
    const { lessonId } = params;
    
    // Mark lesson as complete
    await execute(
      `INSERT INTO progress (user_id, lesson_id, completed, completed_at) 
       VALUES ($1, $2, true, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id) 
       DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP`,
      [user.id, lessonId]
    );
    
    // Check if all lessons are completed
    const allLessons = await getAll('SELECT id FROM lessons');
    const completedLessons = await getAll(
      'SELECT lesson_id FROM progress WHERE user_id = $1 AND completed = true',
      [user.id]
    );
    
    if (completedLessons.length === allLessons.length) {
      const userInfo = await getOne('SELECT email, name FROM users WHERE id = $1', [user.id]);
      if (userInfo) {
        await sendBadgeEmail(userInfo.email, userInfo.name);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Complete lesson error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}