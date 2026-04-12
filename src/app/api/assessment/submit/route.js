import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { answers, userId } = await request.json();
    
    console.log('Assessment submission for user:', userId);
    console.log('Answers received:', Object.keys(answers).length);
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Get all questions
    const questions = await sql`
      SELECT id, correct_answer FROM assessment_questions ORDER BY id
    `;
    
    console.log('Found questions:', questions.length);
    
    if (questions.length === 0) {
      return NextResponse.json({ error: 'No assessment questions found' }, { status: 400 });
    }
    
    // Calculate score
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const userAnswer = answers[`q${i}`];
      const isCorrect = userAnswer !== undefined && parseInt(userAnswer) === questions[i].correct_answer;
      if (isCorrect) {
        score++;
      }
    }
    
    const passed = score >= 16;
    const total = questions.length;
    
    console.log(`Score: ${score}/${total}, Passed: ${passed}`);
    
    // Save attempt to database
    try {
      await sql`
        INSERT INTO assessment_attempts (user_id, score, passed, created_at)
        VALUES (${userId}, ${score}, ${passed}, NOW())
      `;
      console.log('Assessment attempt saved');
    } catch (dbError) {
      console.log('Could not save attempt:', dbError.message);
      // Continue even if save fails
    }
    
    // If passed, mark final lesson as complete
    if (passed) {
      try {
        await sql`
          INSERT INTO progress (user_id, lesson_id, completed, completed_at)
          VALUES (${userId}, '5', true, NOW())
          ON CONFLICT (user_id, lesson_id) DO UPDATE 
          SET completed = true, completed_at = NOW()
        `;
        console.log('Final lesson marked complete');
      } catch (progressError) {
        console.log('Could not mark progress:', progressError.message);
      }
    }
    
    return NextResponse.json({ 
      score, 
      total, 
      passed,
      message: passed ? 'Congratulations! You passed!' : 'You did not pass. Try again!'
    });
    
  } catch (error) {
    console.error('Assessment submit error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to submit assessment' 
    }, { status: 500 });
  }
}