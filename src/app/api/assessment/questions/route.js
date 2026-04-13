import { NextResponse } from 'next/server';
import { getAssessmentQuestions, hasUserPaid } from '@/lib/db';

export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const hasPaid = await hasUserPaid(sessionId);
  if (!hasPaid) return NextResponse.json({ error: 'Payment required' }, { status: 403 });
  
  const questions = await getAssessmentQuestions();
  return NextResponse.json({ questions });
}