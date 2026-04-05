import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendCongratulatoryEmail, scheduleCertificateEmail } from '@/utils/email';

export async function POST(request) {
  try {
    const user = await requireAuth();
    const db = await getDb();
    const { answers } = await request.json();
    
    // Get all questions
    const questions = await db.all('SELECT * FROM assessment_questions ORDER BY id');
    
    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found' },
        { status: 400 }
      );
    }
    
    // Calculate score
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const userAnswer = answers[`q${i}`];
      if (userAnswer !== undefined && userAnswer !== '' && parseInt(userAnswer) === questions[i].correct_answer) {
        score++;
      }
    }
    
    const passed = score >= 16; // Need 16/20 to pass
    const total = questions.length;
    
    // Check if user already passed before
    const existingPass = await db.get(
      'SELECT passed FROM assessment_attempts WHERE user_id = ? AND passed = 1 ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );
    
    // Store attempt
    await db.run(
      'INSERT INTO assessment_attempts (user_id, score, passed) VALUES (?, ?, ?)',
      [user.id, score, passed]
    );
    
    if (passed) {
      // Mark final assessment lesson as complete (lesson id 5)
      await db.run(
        `INSERT OR REPLACE INTO progress (user_id, lesson_id, completed, completed_at) 
         VALUES (?, '5', 1, CURRENT_TIMESTAMP)`,
        [user.id]
      );
      
      // Check if all lessons are completed
      const allLessons = await db.all('SELECT id FROM lessons');
      const completedLessons = await db.all(
        'SELECT lesson_id FROM progress WHERE user_id = ? AND completed = 1',
        [user.id]
      );
      
      // Send congratulatory email (first email)
      await sendCongratulatoryEmail(user.email, user.name, score, total);
      
      // Schedule certificate email (second email)
      // In production, you might want to use a queue system
      // For now, send it immediately
      await scheduleCertificateEmail(user.email, user.name, score);
      
      // If all lessons are completed, send badge email as well
      if (completedLessons.length === allLessons.length) {
        const { sendBadgeEmail } = await import('@/utils/email');
        await sendBadgeEmail(user.email, user.name);
      }
    }
    
    return NextResponse.json({ score, total, passed });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}