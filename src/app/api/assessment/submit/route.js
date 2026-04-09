import { NextResponse } from 'next/server';
import { getAssessmentQuestions, getUserById, saveAssessmentAttempt, updateLessonProgress } from '@/lib/db';
import { sendAssessmentPassedEmail, sendAssessmentFailedEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { answers, userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    const questions = getAssessmentQuestions();
    let score = 0;
    
    // Calculate score
    questions.forEach((q, index) => {
      const userAnswer = answers[`q${index}`];
      if (userAnswer !== undefined && parseInt(userAnswer) === q.correct_answer) {
        score++;
      }
    });
    
    const passed = score >= 16;
    const total = questions.length;
    
    // Save attempt
    saveAssessmentAttempt(userId, score, passed);
    
    // If passed, mark final lesson as complete
    if (passed) {
      updateLessonProgress(userId, '5', true);
    }
    
    // Send email based on result
    if (passed) {
      await sendAssessmentPassedEmail(user.name, user.email, score, total);
    } else {
      await sendAssessmentFailedEmail(user.name, user.email, score, total);
    }
    
    return NextResponse.json({ score, total, passed });
  } catch (error) {
    console.error('Assessment submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}