import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send welcome email to NEW USER (not admin)
export async function sendWelcomeEmail(userEmail, userName) {
  console.log(`Preparing welcome email for: ${userEmail}`); // Debug log
  
  const mailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: userEmail,  // ← Send to the user who just registered
    subject: '🎉 Welcome to Dodo Academy! Start Your Cybersecurity Journey',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Dodo Academy, ${userName}! 🎓</h2>
        <p>Thank you for joining Dodo Academy. You've taken the first step towards becoming a cybersecurity professional.</p>
        <h3>🚀 Next Steps:</h3>
        <ul>
          <li>Enroll in our Cybersecurity Foundation course</li>
          <li>Complete lessons at your own pace</li>
          <li>Pass the assessment and earn your certificate</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/foundation" style="background: #0B1E33; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Learning</a>
        <hr>
        <p style="font-size: 12px;">Dodo Academy - Securing Nigeria's Digital Future</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`, info.messageId);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
}

// Send congratulatory email to USER after passing assessment
export async function sendCongratulatoryEmail(userEmail, userName, score, total) {
  const mailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: userEmail,  // ← Send to the user, not admin
    subject: '🎉 Congratulations! You Passed the Assessment!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations, ${userName}! 🎉</h2>
        <p>You passed the Cybersecurity Foundation assessment with a score of <strong>${score}/${total}</strong>!</p>
        <p>Your certificate will be emailed to you shortly.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/foundation/dashboard" style="background: #0B1E33; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Congratulatory email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Congratulatory email error:', error);
    return false;
  }
}

// Send certificate email to USER
export async function sendCertificateEmail(userEmail, userName, score, certificateId) {
  const certificateUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/certificate/${certificateId}`;
  
  const mailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: userEmail,  // ← Send to the user, not admin
    subject: '📜 Your Dodo Academy Certificate is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Certificate is Ready, ${userName}! 📜</h2>
        <p>Certificate ID: ${certificateId}</p>
        <a href="${certificateUrl}" style="background: #FFB347; color: #0B1E33; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Certificate</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Certificate email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Certificate email error:', error);
    return false;
  }
}

// Send critical inquiry notification to ADMIN ONLY
export async function sendCriticalInquiryEmail(inquiryData) {
  const { name, email, phone, organization, message } = inquiryData;
  
  // This goes to ADMIN, not the user
  const adminMailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,  // ← Only this one goes to admin
    subject: `🔐 New Critical Infrastructure Inquiry from ${name}`,
    html: `
      <h2>New Critical Infrastructure Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
      <p><strong>Message:</strong> ${message || 'No message'}</p>
    `,
  };

  try {
    await transporter.sendMail(adminMailOptions);
    console.log(`Critical inquiry notification sent to admin`);
    return true;
  } catch (error) {
    console.error('Critical inquiry email error:', error);
    return false;
  }
}