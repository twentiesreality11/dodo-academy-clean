export const dynamic = 'force-dynamic';

import { requireAuth } from '@/lib/auth';
import { getOne, getAll, execute } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendCongratulatoryEmail, scheduleCertificateEmail } from '@/utils/email';

export async function POST(request) {
  try {
    const user = await requireAuth();
    const { answers } = await request.json();
    
    // Get all questions
    const questions = await getAll('SELECT * FROM assessment_questions ORDER BY id');
    
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
    
    const passed = score >= 16;
    const total = questions.length;
    
    // Check if user already passed before
    const existingPass = await getOne(
      'SELECT passed FROM assessment_attempts WHERE user_id = $1 AND passed = true ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );
    
    // Store attempt
    await execute(
      'INSERT INTO assessment_attempts (user_id, score, passed) VALUES ($1, $2, $3)',
      [user.id, score, passed]
    );
    
    if (passed && !existingPass) {
      // Mark final assessment lesson as complete (lesson id 5)
      await execute(
        `INSERT INTO progress (user_id, lesson_id, completed, completed_at) 
         VALUES ($1, '5', true, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, lesson_id) 
         DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP`,
        [user.id]
      );
      
      // Send congratulatory email
      await sendCongratulatoryEmail(user.email, user.name, score, total);
      
      // Send certificate email
      await scheduleCertificateEmail(user.email, user.name, score);
      
      // Check if all lessons are completed for badge
      const allLessons = await getAll('SELECT id FROM lessons');
      const completedLessons = await getAll(
        'SELECT lesson_id FROM progress WHERE user_id = $1 AND completed = true',
        [user.id]
      );
      
      if (completedLessons.length === allLessons.length) {
        const { sendBadgeEmail } = await import('@/utils/email');
        await sendBadgeEmail(user.email, user.name);
      }
    }
    
    return NextResponse.json({ score, total, passed });
  } catch (error) {
    console.error('Assessment submit error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}