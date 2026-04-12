import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LESSONS = [
  { id: '1', title: 'Introduction to Cybersecurity', content: '...', order_num: 1 },
  { id: '2', title: 'Network Security Fundamentals', content: '...', order_num: 2 },
  { id: '3', title: 'Cryptography Basics', content: '...', order_num: 3 },
  { id: '4', title: 'Ethical Hacking Basics', content: '...', order_num: 4 },
  { id: '5', title: 'Final Assessment', content: '...', order_num: 5 },
];

export async function GET(request, { params }) {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { lessonId } = params;
  const lesson = LESSONS.find(l => l.id === lessonId);
  
  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }
  
  return NextResponse.json({ lesson, completed: false });
}