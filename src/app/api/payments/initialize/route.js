import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }
    
    const { lessonId } = await request.json();
    const reference = `DODO-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const amount = 5000000; // ₦50,000 in kobo
    
    // Get user email from session (simplified)
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?reference=${reference}`;
    
    // For demo, we'll simulate payment
    console.log('Payment initialized for reference:', reference);
    
    // In production, call Paystack API here
    // For now, simulate success
    return NextResponse.json({ 
      authorization_url: `/payment-success?reference=${reference}`,
      reference: reference
    });
    
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}