import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { name, email, password, redirect } = await request.json();
    
    console.log('Registration attempt:', { name, email });
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if user exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    
    // Create user
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    
    await sql`
      INSERT INTO users (id, name, email, password, created_at)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword}, ${now})
    `;
    
    console.log('User created:', userId);
    
    // AUTO-GRANT ACCESS FOR TESTING
    // This creates a payment record automatically so users can access lessons immediately
    await sql`
      INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
      VALUES (gen_random_uuid(), ${userId}, 'AUTO-${Date.now()}', 5000000, 'success', 'foundation', NOW())
      ON CONFLICT (user_id, course_type) DO NOTHING
    `;
    
    // Initialize progress for lessons
    const lessons = await sql`SELECT id FROM lessons`;
    for (const lesson of lessons) {
      await sql`
        INSERT INTO progress (user_id, lesson_id, completed) 
        VALUES (${userId}, ${lesson.id}, false)
        ON CONFLICT (user_id, lesson_id) DO NOTHING
      `;
    }
    
    console.log('Auto-granted access for user:', userId);
    
    const response = NextResponse.json({ 
      success: true, 
      redirect: redirect || '/foundation/dashboard' 
    });
    
    response.cookies.set('session', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    
    return response;
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}