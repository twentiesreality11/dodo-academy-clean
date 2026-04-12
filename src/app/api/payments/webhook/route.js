import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-paystack-signature');
    
    // Verify webhook signature (optional but recommended)
    // const crypto = require('crypto');
    // const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(body)).digest('hex');
    // if (hash !== signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    
    if (body.event === 'charge.success') {
      const transactionRef = body.data.reference;
      const userId = body.data.metadata?.user_id; // You need to pass user_id in metadata
      
      if (!userId) {
        console.log('No user_id in webhook metadata');
        return NextResponse.json({ error: 'No user_id' }, { status: 400 });
      }
      
      const sql = neon(process.env.POSTGRES_URL);
      
      // Save payment
      await sql`
        INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
        VALUES (gen_random_uuid(), ${userId}, ${transactionRef}, ${body.data.amount}, 'success', 'foundation', NOW())
        ON CONFLICT (reference) DO UPDATE SET status = 'success'
      `;
      
      // Initialize progress
      const lessons = await sql`SELECT id FROM lessons`;
      for (const lesson of lessons) {
        await sql`
          INSERT INTO progress (user_id, lesson_id, completed) 
          VALUES (${userId}, ${lesson.id}, false)
          ON CONFLICT DO NOTHING
        `;
      }
      
      console.log('Webhook processed for user:', userId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}