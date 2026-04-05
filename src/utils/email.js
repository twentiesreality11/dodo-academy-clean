import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send welcome email to new user
export async function sendWelcomeEmail(userEmail, userName) {
  const mailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🎉 Welcome to Dodo Academy!',
    html: `<h2>Welcome ${userName}!</h2><p>Thank you for joining Dodo Academy.</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
}

// Send congratulatory email after passing assessment
export async function sendCongratulatoryEmail(userEmail, userName, score, total) {
  const mailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🎉 Congratulations! You Passed!',
    html: `<h2>Congratulations ${userName}!</h2><p>You scored ${score}/${total}!</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Congratulatory email error:', error);
    return false;
  }
}

// Send certificate email
export async function sendCertificateEmail(userEmail, userName, score, certificateId) {
  const mailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '📜 Your Certificate is Ready!',
    html: `<h2>Certificate Ready!</h2><p>Certificate ID: ${certificateId}</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Certificate email error:', error);
    return false;
  }
}

// Alias for scheduleCertificateEmail
export const scheduleCertificateEmail = sendCertificateEmail;

// Send badge email
export async function sendBadgeEmail(userEmail, userName) {
  const mailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🏅 You Earned a Badge!',
    html: `<h2>Congratulations ${userName}!</h2><p>You earned your Cybersecurity badge!</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Badge email error:', error);
    return false;
  }
}

// Send critical infrastructure inquiry to admin
export async function sendCriticalInquiryEmail(inquiryData) {
  const { name, email, message } = inquiryData;
  const mailOptions = {
    from: `"Dodo Academy" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🔐 New Inquiry from ${name}`,
    html: `<h2>New Inquiry</h2><p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Critical inquiry email error:', error);
    return false;
  }
}

// Alias for sendInquiryNotification (used by inquiries API)
export const sendInquiryNotification = sendCriticalInquiryEmail;