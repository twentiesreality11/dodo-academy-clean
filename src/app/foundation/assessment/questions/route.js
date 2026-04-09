import { NextResponse } from 'next/server';
import { getAssessmentQuestions } from '@/lib/db';

export async function GET() {
  try {
    const questions = getAssessmentQuestions();
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}