import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Please login first' },
        { status: 401 }
      );
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    const users = await sql`
      SELECT id, email FROM users WHERE id = ${sessionId}
    `;
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }
    
    const user = users[0];
    const reference = `DODO-${uuidv4()}`;
    const amount = 5000000;
    
    // Use native fetch instead of axios
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount,
        reference: reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`,
      }),
    });
    
    const data = await response.json();
    
    if (data.status) {
      await sql`
        INSERT INTO payments (id, user_id, reference, amount, status, course_type)
        VALUES (${uuidv4()}, ${user.id}, ${reference}, ${amount}, 'pending', 'foundation')
      `;
      
      return NextResponse.json({ 
        authorization_url: data.data.authorization_url 
      });
    } else {
      return NextResponse.json(
        { error: data.message || 'Payment initiation failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}