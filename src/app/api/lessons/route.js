import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Hardcoded lessons for demo
const LESSONS = [
  { 
    id: '1', 
    title: 'Introduction to Cybersecurity', 
    order_num: 1,
    content: '<div class="lesson-content"><h2>Introduction to Cybersecurity</h2><p>Welcome to the course! This is a preview. Purchase to unlock full content.</p></div>'
  },
  { 
    id: '2', 
    title: 'Network Security Fundamentals', 
    order_num: 2,
    content: '<div class="lesson-content"><h2>Network Security</h2><p>This is a preview. Purchase to unlock full content.</p></div>'
  },
  { 
    id: '3', 
    title: 'Cryptography Basics', 
    order_num: 3,
    content: '<div class="lesson-content"><h2>Cryptography</h2><p>This is a preview. Purchase to unlock full content.</p></div>'
  },
  { 
    id: '4', 
    title: 'Ethical Hacking Basics', 
    order_num: 4,
    content: '<div class="lesson-content"><h2>Ethical Hacking</h2><p>This is a preview. Purchase to unlock full content.</p></div>'
  },
  { 
    id: '5', 
    title: 'Final Assessment', 
    order_num: 5,
    content: '<div class="lesson-content"><h2>Final Assessment</h2><p>Purchase to unlock the final assessment.</p></div>'
  },
];

export async function GET(request) {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Return lessons without payment check
  return NextResponse.json({ lessons: LESSONS });
}