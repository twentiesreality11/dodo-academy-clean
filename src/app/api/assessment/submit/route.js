import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { sendCertificateEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { answers, userId } = await request.json();
    
    console.log('Assessment submission for user:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Get questions
    const questions = await sql`
      SELECT id, correct_answer FROM assessment_questions ORDER BY id
    `;
    
    if (questions.length === 0) {
      return NextResponse.json({ error: 'No assessment questions found' }, { status: 400 });
    }
    
    // Calculate score
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const userAnswer = answers[`q${i}`];
      if (userAnswer !== undefined && parseInt(userAnswer) === questions[i].correct_answer) {
        score++;
      }
    }
    
    const passed = score >= 16;
    const total = questions.length;
    
    console.log(`Score: ${score}/${total}, Passed: ${passed}`);
    
    // Save attempt
    await sql`
      INSERT INTO assessment_attempts (user_id, score, passed, created_at)
      VALUES (${userId}, ${score}, ${passed}, NOW())
    `;
    
    // If passed, mark final lesson complete and send certificate
    if (passed) {
      await sql`
        INSERT INTO progress (user_id, lesson_id, completed, completed_at)
        VALUES (${userId}, '5', true, NOW())
        ON CONFLICT (user_id, lesson_id) DO UPDATE 
        SET completed = true, completed_at = NOW()
      `;
      
      // Get user details for email
      const users = await sql`
        SELECT name, email FROM users WHERE id = ${userId}
      `;
      
      if (users && users.length > 0) {
        const user = users[0];
        const certificateId = `DODO-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        
        // Send certificate email
        try {
          await sendCertificateEmail(user.name, user.email, score, total, certificateId);
          console.log('Certificate email sent to:', user.email);
        } catch (emailError) {
          console.error('Certificate email failed:', emailError);
        }
      }
    }
    
    return NextResponse.json({ score, total, passed });
    
  } catch (error) {
    console.error('Assessment submit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}