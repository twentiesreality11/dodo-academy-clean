import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Welcome email on registration
export async function sendWelcomeEmail(userName, userEmail) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/foundation/dashboard`;
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Welcome to Dodo Academy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #f4f7fb; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0B1E33 0%, #1A3A5F 100%); padding: 30px; text-align: center; }
        .header h1 { color: #FFB347; margin: 0; font-size: 28px; }
        .header p { color: white; margin: 10px 0 0; }
        .content { background: white; padding: 30px; }
        .button { display: inline-block; background: #0B1E33; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Dodo Academy</h1>
          <p>Welcome to the Cybersecurity Family</p>
        </div>
        <div class="content">
          <h2>Hello ${userName}! 👋</h2>
          <p>Thank you for joining <strong>Dodo Academy</strong>. You've taken the first step toward becoming a cybersecurity professional.</p>
          
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #2e7d32;">✅ Registration Successful!</p>
          </div>
          
          <h3>🚀 What's Next?</h3>
          <ul>
            <li>Enroll in the Cybersecurity Foundation course</li>
            <li>Complete lessons at your own pace</li>
            <li>Pass the final assessment and earn your certificate</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
          </div>
          
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Need help? Contact us at support@dodoacademy.ng</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Dodo Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    await transporter.sendMail({
      from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🎉 Welcome to Dodo Academy! Start Your Cybersecurity Journey',
      html,
    });
    console.log(`Welcome email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
}

// Certificate email with digital badge
export async function sendCertificateEmail(userName, userEmail, score, total, certificateId) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/foundation/dashboard`;
  const certificateUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/certificate/${certificateId}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`;
  
  // Generate badge SVG (simple HTML/CSS badge)
  const badgeSvg = `
    <div style="text-align: center; margin: 20px 0;">
      <div style="display: inline-block; background: linear-gradient(135deg, #FFB347 0%, #FF8C00 100%); width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="text-align: center; color: white;">
          <div style="font-size: 40px;">🏅</div>
          <div style="font-size: 12px; font-weight: bold;">CYBERSECURITY</div>
          <div style="font-size: 10px;">FOUNDATION</div>
        </div>
      </div>
    </div>
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your Certificate - Dodo Academy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #f4f7fb; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0B1E33 0%, #1A3A5F 100%); padding: 30px; text-align: center; }
        .header h1 { color: #FFB347; margin: 0; font-size: 28px; }
        .content { background: white; padding: 30px; }
        .certificate-box { background: #fff8e1; border: 2px solid #FFB347; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        .certificate-id { font-family: monospace; background: #f0f0f0; padding: 5px 10px; border-radius: 5px; font-size: 12px; }
        .button { display: inline-block; background: #0B1E33; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; margin: 10px 5px; }
        .button-gold { background: #FFB347; color: #0B1E33; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏆 Congratulations! 🏆</h1>
          <p>You've Earned Your Certificate</p>
        </div>
        <div class="content">
          <h2>Dear ${userName},</h2>
          <p>Congratulations on completing the <strong>Cybersecurity Foundation Course</strong>!</p>
          
          <div class="certificate-box">
            ${badgeSvg}
            <h3 style="color: #0B1E33; margin: 10px 0;">Certificate of Completion</h3>
            <p>Presented to</p>
            <h2 style="color: #FFB347;">${userName}</h2>
            <p>For successfully completing the Cybersecurity Foundation course with a score of <strong>${score}/${total}</strong></p>
            <p class="certificate-id">Certificate ID: ${certificateId}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${certificateUrl}" class="button">📥 Download Certificate</a>
            <a href="${linkedInShareUrl}" target="_blank" class="button button-gold">💼 Share on LinkedIn</a>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">💡 What's Next?</p>
            <ul style="margin: 10px 0 0 20px;">
              <li>Add this certificate to your LinkedIn profile</li>
              <li>Enroll in our advanced Critical Infrastructure Protection course</li>
              <li>Join our alumni network for exclusive opportunities</li>
            </ul>
          </div>
          
          <hr>
          <p style="text-align: center; font-size: 14px;">Keep learning and stay secure!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Dodo Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    await transporter.sendMail({
      from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🏅 Congratulations! You\'ve Earned Your Cybersecurity Certificate',
      html,
    });
    console.log(`Certificate email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Certificate email error:', error);
    return false;
  }
}