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
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
  const courseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/foundation`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f7fb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0B1E33 0%, #1A3A5F 100%); padding: 30px; text-align: center;">
        <h1 style="color: #FFB347; margin: 0;">Dodo Academy</h1>
        <p style="color: white; margin: 10px 0 0;">Welcome to the Cybersecurity Family</p>
      </div>
      <div style="background: white; padding: 30px;">
        <h2 style="color: #0B1E33; margin-top: 0;">Hello ${userName}! 🎉</h2>
        <p style="color: #333; line-height: 1.6;">Thank you for joining Dodo Academy. You've taken the first step toward becoming a cybersecurity professional.</p>
        
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #2e7d32;">✅ Registration Successful!</p>
        </div>
        
        <h3 style="color: #0B1E33;">🚀 Next Steps:</h3>
        <ul style="color: #555; line-height: 1.8;">
          <li>Enroll in our Cybersecurity Foundation course</li>
          <li>Complete lessons at your own pace</li>
          <li>Pass the final assessment and earn your certificate</li>
        </ul>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${courseUrl}" style="background: #0B1E33; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; display: inline-block;">Start Learning Now</a>
        </div>
        
        <hr style="margin: 20px 0; border-color: #e0e0e0;">
        <p style="color: #666; font-size: 12px; text-align: center;">Need help? Contact us at support@dodoacademy.ng</p>
      </div>
    </div>
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

// Assessment passed email with certificate
export async function sendAssessmentPassedEmail(userName, userEmail, score, totalQuestions) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/foundation/dashboard`;
  const certificateId = `DODO-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f7fb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0B1E33 0%, #1A3A5F 100%); padding: 30px; text-align: center;">
        <h1 style="color: #FFB347; margin: 0;">🎉 Congratulations!</h1>
        <p style="color: white; margin: 10px 0 0;">You Passed the Assessment</p>
      </div>
      <div style="background: white; padding: 30px;">
        <h2 style="color: #0B1E33; margin-top: 0;">Well Done, ${userName}! 🎓</h2>
        <p style="color: #333; line-height: 1.6;">You have successfully completed the Cybersecurity Foundation course assessment.</p>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #0B1E33;">${score}/${totalQuestions}</p>
          <p style="margin: 5px 0 0; color: #555;">Your Score</p>
        </div>
        
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #e65100;">📜 Certificate Information:</p>
          <p style="margin: 10px 0 0;">Certificate ID: <strong>${certificateId}</strong></p>
          <p>Issued to: <strong>${userName}</strong></p>
          <p>Date: <strong>${new Date().toLocaleDateString()}</strong></p>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${dashboardUrl}" style="background: #FFB347; color: #0B1E33; padding: 12px 30px; text-decoration: none; border-radius: 30px; display: inline-block;">View Your Dashboard</a>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">💡 What's Next?</p>
          <ul style="margin: 10px 0 0 20px; color: #555;">
            <li>Add your certificate to LinkedIn</li>
            <li>Enroll in our advanced Critical Infrastructure Protection course</li>
            <li>Join our alumni network for exclusive opportunities</li>
          </ul>
        </div>
        
        <hr style="margin: 20px 0; border-color: #e0e0e0;">
        <p style="color: #666; font-size: 12px; text-align: center;">Keep learning and stay secure!</p>
      </div>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🎓 Congratulations! You Passed the Cybersecurity Foundation Assessment',
      html,
    });
    console.log(`Assessment passed email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Assessment email error:', error);
    return false;
  }
}

// Assessment failed email (optional but encouraging)
export async function sendAssessmentFailedEmail(userName, userEmail, score, totalQuestions) {
  const assessmentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/foundation/assessment`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f7fb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0B1E33 0%, #1A3A5F 100%); padding: 30px; text-align: center;">
        <h1 style="color: #FFB347; margin: 0;">📚 Keep Going!</h1>
        <p style="color: white; margin: 10px 0 0;">You're Almost There</p>
      </div>
      <div style="background: white; padding: 30px;">
        <h2 style="color: #0B1E33; margin-top: 0;">Almost There, ${userName}! 💪</h2>
        <p style="color: #333; line-height: 1.6;">You scored <strong>${score}/${totalQuestions}</strong> on the assessment.</p>
        <p style="color: #333; line-height: 1.6;">The passing score is 16/20. You were close!</p>
        
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">💡 Tips for Success:</p>
          <ul style="margin: 10px 0 0 20px;">
            <li>Review the lesson materials again</li>
            <li>Focus on topics where you scored lower</li>
            <li>Take the practice quizzes</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${assessmentUrl}" style="background: #0B1E33; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; display: inline-block;">Try Assessment Again</a>
        </div>
        
        <hr style="margin: 20px 0; border-color: #e0e0e0;">
        <p style="color: #666; font-size: 12px; text-align: center;">Don't give up! Every attempt brings you closer to success.</p>
      </div>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '📚 Keep Learning - Assessment Update from Dodo Academy',
      html,
    });
    console.log(`Assessment failed email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Assessment failed email error:', error);
    return false;
  }
}