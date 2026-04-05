import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendBadgeEmail } from '@/utils/email';

export async function POST(request, { params }) {
  try {
    const user = await requireAuth();
    const db = await getDb();
    const { lessonId } = params;


    
    // Mark lesson as complete
    await db.run(
      `INSERT OR REPLACE INTO progress (user_id, lesson_id, completed, completed_at) 
       VALUES (?, ?, 1, CURRENT_TIMESTAMP)`,
      [user.id, lessonId]
    );
    
    // Check if all lessons are completed
    const allLessons = await db.all('SELECT id FROM lessons');
    const completedLessons = await db.all(
      'SELECT lesson_id FROM progress WHERE user_id = ? AND completed = 1',
      [user.id]
    );
    
    if (completedLessons.length === allLessons.length) {
      // All lessons completed - send badge email
      await sendBadgeEmail(user.email, user.name);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}