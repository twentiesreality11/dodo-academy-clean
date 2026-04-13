import { NextResponse } from 'next/server';
import { getAssessmentQuestions, saveAssessmentAttempt, markLessonComplete } from '@/lib/db';

export async function POST(request) {
  try {
    const { answers, userId } = await request.json();
    const questions = await getAssessmentQuestions();
    
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[`q${index}`] !== undefined && parseInt(answers[`q${index}`]) === q.correct_answer) score++;
    });
    
    const passed = score >= 16;
    await saveAssessmentAttempt(userId, score, passed);
    
    if (passed) await markLessonComplete(userId, '5');
    
    return NextResponse.json({ score, total: questions.length, passed });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}