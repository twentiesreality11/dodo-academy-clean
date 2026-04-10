import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  
  console.log('=== PAYMENT VERIFICATION ===');
  console.log('Reference:', reference);
  
  if (!reference) {
    return NextResponse.json(
      { success: false, error: 'No payment reference provided' },
      { status: 400 }
    );
  }
  
  try {
    // Verify with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    
    const data = await response.json();
    console.log('Paystack verification:', data.status, data.data?.status);
    
    if (!data.status || data.data?.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }
    
    // Check database connection
    if (!process.env.POSTGRES_URL) {
      console.log('No database URL');
      // Still consider payment successful
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified but no database' 
      });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    try {
      // Update payment status
      const updateResult = await sql`
        UPDATE payments 
        SET status = 'success' 
        WHERE reference = ${reference}
        RETURNING user_id
      `;
      
      console.log('Update result:', updateResult);
      
      if (updateResult && updateResult.length > 0) {
        const userId = updateResult[0].user_id;
        
        // Try to initialize progress, but don't fail if lessons table doesn't exist yet
        try {
          const lessons = await sql`SELECT id FROM lessons`;
          for (const lesson of lessons) {
            await sql`
              INSERT INTO progress (user_id, lesson_id, completed) 
              VALUES (${userId}, ${lesson.id}, false)
              ON CONFLICT (user_id, lesson_id) DO NOTHING
            `;
          }
          console.log('Progress initialized');
        } catch (progressError) {
          console.log('Progress initialization skipped:', progressError.message);
        }
      }
    } catch (dbError) {
      console.log('Database update error:', dbError.message);
      // Don't fail - payment is still verified
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified successfully' 
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}