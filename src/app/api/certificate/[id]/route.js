import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const certificateId = params.id;
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    if (!process.env.POSTGRES_URL) {
      return new Response('Certificate not found', { status: 404 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Get user and assessment data
    const userData = await sql`
      SELECT u.name, u.email, a.score, a.created_at
      FROM users u
      JOIN assessment_attempts a ON u.id = a.user_id
      WHERE u.id = ${sessionId} AND a.passed = true
      ORDER BY a.created_at DESC
      LIMIT 1
    `;
    
    if (!userData || userData.length === 0) {
      return new Response('Certificate not found', { status: 404 });
    }
    
    const user = userData[0];
    
    // Generate HTML certificate
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificate of Completion - Dodo Academy</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: 'Georgia', serif;
          }
          .certificate {
            width: 800px;
            height: 600px;
            background: white;
            border: 20px solid #0B1E33;
            position: relative;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .certificate:before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 2px solid #FFB347;
            pointer-events: none;
          }
          h1 { color: #0B1E33; font-size: 42px; text-align: center; margin: 0; }
          h2 { color: #FFB347; font-size: 24px; text-align: center; margin: 10px 0; }
          .recipient { font-size: 32px; font-weight: bold; color: #0B1E33; text-align: center; margin: 40px 0; }
          .content { text-align: center; margin: 50px 0; }
          .date { margin-top: 50px; text-align: center; color: #666; }
          .signature { margin-top: 40px; text-align: left; font-style: italic; }
          .seal {
            position: absolute;
            bottom: 80px;
            right: 60px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #FFB347;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            text-align: center;
            color: #0B1E33;
            font-weight: bold;
          }
          .certificate-id {
            position: absolute;
            bottom: 20px;
            left: 40px;
            font-size: 10px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>DODO ACADEMY</h1>
          <h2>Certificate of Completion</h2>
          <div class="content">
            <p>This certificate is proudly presented to</p>
            <div class="recipient">${user.name}</div>
            <p>for successfully completing the</p>
            <h2>Cybersecurity Foundation Course</h2>
            <p>with a score of <strong>${user.score}/20</strong></p>
            <div class="date">Date: ${new Date(user.created_at).toLocaleDateString()}</div>
          </div>
          <div class="signature">
            <p>_____________________<br>Dr. Adebayo Ogunlesi<br>Director, Dodo Academy</p>
          </div>
          <div class="seal">DODO<br>ACADEMY</div>
          <div class="certificate-id">Certificate ID: ${certificateId}</div>
        </div>
      </body>
      </html>
    `;
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Certificate error:', error);
    return new Response('Error generating certificate', { status: 500 });
  }
}