export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const db = await getDb();
    
    // Parse certificate ID to get user info
    // Format: DODO-timestamp-random
    const certificateId = id;
    
    // Find the user who passed assessment around this time
    // This is a simplified version - in production, store certificate info in DB
    const user = await db.get(`
      SELECT u.name, u.email, a.score, a.created_at 
      FROM assessment_attempts a
      JOIN users u ON a.user_id = u.id
      WHERE a.passed = 1 
      ORDER BY a.created_at DESC 
      LIMIT 1
    `);
    
    if (!user) {
      return new NextResponse('Certificate not found', { status: 404 });
    }
    
    // Generate HTML certificate
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificate of Completion - Dodo Academy</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinema&family=Playfair+Display:wght@400;700&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: 'Playfair Display', serif;
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
          
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #0B1E33;
            font-size: 42px;
            margin: 0;
            letter-spacing: 2px;
          }
          
          .header h2 {
            color: #FFB347;
            font-size: 24px;
            margin: 10px 0 0;
            font-weight: normal;
          }
          
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
            opacity: 0.8;
          }
          
          .content {
            text-align: center;
            margin: 50px 0;
          }
          
          .recipient {
            font-size: 36px;
            font-weight: bold;
            color: #0B1E33;
            margin: 20px 0;
            border-bottom: 2px solid #FFB347;
            display: inline-block;
            padding-bottom: 10px;
          }
          
          .course {
            font-size: 24px;
            color: #555;
            margin: 20px 0;
          }
          
          .date {
            margin-top: 50px;
            color: #666;
          }
          
          .signature {
            margin-top: 40px;
            text-align: left;
            font-style: italic;
          }
          
          .id {
            font-size: 10px;
            color: #999;
            position: absolute;
            bottom: 20px;
            left: 40px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <h1>DODO ACADEMY</h1>
            <h2>Certificate of Completion</h2>
          </div>
          
          <div class="content">
            <p>This certificate is proudly presented to</p>
            <div class="recipient">${user.name}</div>
            <p>for successfully completing the</p>
            <div class="course">Cybersecurity Foundation Course</div>
            <p>with a score of <strong>${user.score}/20</strong></p>
            <div class="date">
              Date: ${new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div class="signature">
            <p>_____________________<br>
            Dr. Adebayo Ogunlesi<br>
            Director, Dodo Academy</p>
          </div>
          
          <div class="seal">
            DODO<br>ACADEMY
          </div>
          
          <div class="id">
            Certificate ID: ${certificateId}
          </div>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Certificate error:', error);
    return new NextResponse('Error generating certificate', { status: 500 });
  }
}