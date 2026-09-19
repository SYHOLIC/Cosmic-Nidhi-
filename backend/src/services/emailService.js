const sgMail = require('@sendgrid/mail');
require('dotenv').config();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('⚠️ WARNING: SENDGRID_API_KEY is missing from environment variables!');
}

/**
 * Send a branded 6-digit OTP verification email
 */
const sendVerificationOTP = async (toEmail, name, otp) => {
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'swapnilcipher@gmail.com';
  const recipientName = name || 'Seeker';

  console.log(`🔑 [OTP DISPATCH] Generated OTP for ${toEmail}: [ ${otp} ]`);

  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not set in environment variables.');
    throw new Error('Email service is not configured. Please add SENDGRID_API_KEY to your Render environment.');
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cosmic Nidhi - Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0F0204;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #FFF8EC;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0F0204;
      padding: 40px 15px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background: linear-gradient(180deg, #260005 0%, #170104 100%);
      border: 1px solid rgba(233, 165, 52, 0.25);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
    }
    .header {
      padding: 36px 30px 20px;
      text-align: center;
      background: radial-gradient(circle at top, rgba(233, 165, 52, 0.15) 0%, transparent 70%);
      border-bottom: 1px solid rgba(233, 165, 52, 0.15);
    }
    .logo-text {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #E9A534;
      text-transform: uppercase;
      margin: 0;
    }
    .tagline {
      font-size: 11px;
      letter-spacing: 3px;
      color: #FDECC8;
      opacity: 0.7;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .content {
      padding: 36px 32px;
      text-align: center;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 14px;
    }
    .paragraph {
      font-size: 14px;
      line-height: 1.6;
      color: rgba(255, 248, 236, 0.8);
      margin: 0 0 26px 0;
    }
    .otp-box {
      margin: 28px auto;
      padding: 18px 24px;
      background: rgba(233, 165, 52, 0.08);
      border: 2px dashed #E9A534;
      border-radius: 12px;
      display: inline-block;
    }
    .otp-code {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #FFD57E;
      font-family: 'Courier New', Courier, monospace;
      margin-left: 10px;
    }
    .expiry {
      font-size: 12px;
      color: #E9A534;
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .footer {
      padding: 24px 30px;
      background-color: #100103;
      border-top: 1px solid rgba(233, 165, 52, 0.1);
      text-align: center;
      font-size: 11px;
      color: rgba(255, 248, 236, 0.45);
      line-height: 1.6;
    }
    .divider {
      width: 40px;
      height: 2px;
      background: #E9A534;
      margin: 20px auto;
      opacity: 0.4;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo-text">Cosmic Nidhi</h1>
        <div class="tagline">Astrology &bull; Zodiac &bull; Guidance</div>
      </div>
      <div class="content">
        <div class="greeting">Namaste ${recipientName},</div>
        <p class="paragraph">
          Welcome to the Cosmic Family! To verify your email address and activate your account, please enter the following 6-digit verification code:
        </p>
        <div class="otp-box">
          <span class="otp-code">${otp}</span>
        </div>
        <div class="expiry">
          &#9201; This code expires in 10 minutes.
        </div>
        <div class="divider"></div>
        <p class="paragraph" style="font-size: 12px; color: rgba(255, 248, 236, 0.5); margin-bottom: 0;">
          If you did not request this registration, you can safely disregard this email.
        </p>
      </div>
      <div class="footer">
        &copy; 2026 Cosmic Nidhi. All rights reserved.<br>
        Personalized Vedic & Western Astrology Guidance
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const msg = {
    to: toEmail,
    from: {
      name: 'Cosmic Nidhi',
      email: fromEmail,
    },
    subject: `Your Cosmic Nidhi Verification Code: ${otp}`,
    text: `Namaste ${recipientName},\n\nYour Cosmic Nidhi verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nBlessings,\nCosmic Nidhi Team`,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`✉️ Verification OTP email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('SendGrid Email Error:', error.response ? error.response.body : error.message);
    throw new Error('Failed to send verification email. Please check your email address.');
  }
};

module.exports = {
  sendVerificationOTP,
};
