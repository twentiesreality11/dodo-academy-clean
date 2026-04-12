import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  // Get session from cookies
  const sessionId = request.cookies.get('session')?.value;
  
  console.log('Payment init - Session:', sessionId);
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Please login first' }, { status: 401 });
  }
  
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }
  
  try {
    const sql = neon(process.env.POSTGRES_URL);
    
    // Get user
    const users = await sql`
      SELECT id, email FROM users WHERE id = ${sessionId}
    `;
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    const user = users[0];
    const reference = `DODO-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const amount = 5000000;
    
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`;
    
    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount,
        reference: reference,
        callback_url: callbackUrl,
        metadata: {
          user_id: user.id
        }
      }),
    });
    
    const paystackData = await paystackResponse.json();
    
    if (paystackData.status) {
      // Store pending payment
      await sql`
        INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
        VALUES (gen_random_uuid(), ${user.id}, ${reference}, ${amount}, 'pending', 'foundation', NOW())
      `;
      
      return NextResponse.json({ 
        authorization_url: paystackData.data.authorization_url 
      });
    } else {
      console.error('Paystack error:', paystackData);
      return NextResponse.json(
        { error: paystackData.message || 'Payment initiation failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed: ' + error.message },
      { status: 500 }
    );
  }
}