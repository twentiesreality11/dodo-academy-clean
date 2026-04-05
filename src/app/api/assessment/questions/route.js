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
    
    // Check if user has already passed
    const passedAttempt = await db.get(
      'SELECT passed FROM assessment_attempts WHERE user_id = ? AND passed = 1 ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );
    
    if (passedAttempt) {
      return NextResponse.json(
        { error: 'You have already passed the assessment' },
        { status: 403 }
      );
    }
    
    // Get all questions
    const questions = await db.all('SELECT * FROM assessment_questions ORDER BY id');
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}