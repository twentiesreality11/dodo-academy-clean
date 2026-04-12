import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-paystack-signature');
    
    console.log('Webhook received:', body.event);
    
    // Verify webhook signature (optional - uncomment for production)
    // const crypto = require('crypto');
    // const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(body)).digest('hex');
    // if (hash !== signature) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }
    
    if (body.event === 'charge.success') {
      const transactionRef = body.data.reference;
      const userId = body.data.metadata?.user_id;
      const amount = body.data.amount;
      
      console.log('Processing webhook for user:', userId, 'reference:', transactionRef);
      
      if (!userId) {
        console.log('No user_id in webhook metadata');
        return NextResponse.json({ error: 'No user_id' }, { status: 400 });
      }
      
      if (!process.env.POSTGRES_URL) {
        console.log('No database URL');
        return NextResponse.json({ error: 'No database' }, { status: 500 });
      }
      
      const sql = neon(process.env.POSTGRES_URL);
      
      // Save payment record
      await sql`
        INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
        VALUES (${uuidv4()}, ${userId}, ${transactionRef}, ${amount}, 'success', 'foundation', NOW())
        ON CONFLICT (reference) DO UPDATE 
        SET status = 'success', user_id = ${userId}
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
      
      console.log('Webhook processed successfully for user:', userId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}