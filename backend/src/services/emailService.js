const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const getApiKey = () => {
  let key = process.env.SENDGRID_API_KEY || '';
  if (key.startsWith('b64:')) {
    try {
      key = Buffer.from(key.slice(4), 'base64').toString('utf8');
    } catch (e) {
      console.error('Failed to decode b64 SENDGRID_API_KEY:', e);
    }
  }
  return key.trim();
};

const initialApiKey = getApiKey();
if (initialApiKey) {
  sgMail.setApiKey(initialApiKey);
} else {
  console.warn('⚠️ WARNING: SENDGRID_API_KEY is missing from environment variables!');
}

/**
 * Send a branded 6-digit OTP verification email
 */
const sendVerificationOTP = async (toEmail, name, otp) => {
  const recipientName = name || 'Seeker';

  console.log(`🔑 [OTP DISPATCH] Generated OTP for ${toEmail}: [ ${otp} ]`);

  const activeApiKey = getApiKey();
  if (!activeApiKey) {
    console.error('❌ SENDGRID_API_KEY is not set in environment variables.');
    throw new Error('Email service is not configured. Please check SENDGRID_API_KEY in Render environment.');
  }

  sgMail.setApiKey(activeApiKey);

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

  let fromEmail = (process.env.SENDGRID_FROM_EMAIL || 'swapnilcipher@gmail.com')
    .trim()
    .replace(/^["']+|["']+$/g, '');

  if (!fromEmail || !fromEmail.includes('@')) {
    fromEmail = 'swapnilcipher@gmail.com';
  }

  const buildMsg = (sender) => ({
    to: toEmail,
    from: {
      name: 'Cosmic Nidhi',
      email: sender,
    },
    subject: `Your Cosmic Nidhi Verification Code: ${otp}`,
    text: `Namaste ${recipientName},\n\nYour Cosmic Nidhi verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nBlessings,\nCosmic Nidhi Team`,
    html: htmlContent,
  });

  try {
    await sgMail.send(buildMsg(fromEmail));
    console.log(`✉️ Verification OTP email sent successfully to ${toEmail} using ${fromEmail}`);
    return true;
  } catch (error) {
    console.error(`SendGrid Email Error (from: ${fromEmail}):`, error.response ? error.response.body : error.message);
    
    // If the configured fromEmail failed and is different from the verified address, retry with swapnilcipher@gmail.com
    if (fromEmail.toLowerCase() !== 'swapnilcipher@gmail.com') {
      console.log('Retrying SendGrid with verified sender swapnilcipher@gmail.com...');
      try {
        await sgMail.send(buildMsg('swapnilcipher@gmail.com'));
        console.log(`✉️ Verification OTP email sent successfully to ${toEmail} via fallback sender swapnilcipher@gmail.com`);
        return true;
      } catch (fallbackError) {
        console.error('SendGrid Fallback Error:', fallbackError.response ? fallbackError.response.body : fallbackError.message);
      }
    }

    const errorDetail = error.response?.body?.errors?.[0]?.message || error.message;
    throw new Error(errorDetail || 'Failed to send verification email. Please check your email address.');
  }
};

/**
 * Reusable helper to send branded emails via SendGrid with fallback sender
 */
const sendCosmicEmail = async ({ to, subject, html, text }) => {
  const activeApiKey = getApiKey();
  if (!activeApiKey) {
    console.warn(`⚠️ Cannot send email to ${to}: SENDGRID_API_KEY is not configured.`);
    return false;
  }
  sgMail.setApiKey(activeApiKey);

  let fromEmail = (process.env.SENDGRID_FROM_EMAIL || 'swapnilcipher@gmail.com')
    .trim()
    .replace(/^["']+|["']+$/g, '');

  if (!fromEmail || !fromEmail.includes('@')) {
    fromEmail = 'swapnilcipher@gmail.com';
  }

  const buildMsg = (sender) => ({
    to,
    from: {
      name: 'Cosmic Nidhi',
      email: sender,
    },
    subject,
    text,
    html,
  });

  try {
    await sgMail.send(buildMsg(fromEmail));
    console.log(`✉️ [Appointment Email] Sent to ${to}: "${subject}" via ${fromEmail}`);
    return true;
  } catch (error) {
    console.error(`SendGrid Error (from: ${fromEmail}):`, error.response ? error.response.body : error.message);
    if (fromEmail.toLowerCase() !== 'swapnilcipher@gmail.com') {
      try {
        await sgMail.send(buildMsg('swapnilcipher@gmail.com'));
        console.log(`✉️ [Appointment Email] Sent fallback to ${to} via swapnilcipher@gmail.com`);
        return true;
      } catch (fallbackError) {
        console.error('SendGrid Fallback Error:', fallbackError.response ? fallbackError.response.body : fallbackError.message);
      }
    }
    return false;
  }
};

const getEmailTemplate = ({ title, preheader, greeting, intro, detailsList = [], note, actionText, actionUrl }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0F0204; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFF8EC; }
    .wrapper { width: 100%; background-color: #0F0204; padding: 40px 15px; }
    .container { max-width: 580px; margin: 0 auto; background: linear-gradient(180deg, #260005 0%, #170104 100%); border: 1px solid rgba(233, 165, 52, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
    .header { padding: 32px 30px 20px; text-align: center; border-bottom: 1px solid rgba(233, 165, 52, 0.15); background: radial-gradient(circle at top, rgba(233, 165, 52, 0.15) 0%, transparent 70%); }
    .logo-text { font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #E9A534; text-transform: uppercase; margin: 0; }
    .tagline { font-size: 10px; letter-spacing: 3px; color: #FDECC8; opacity: 0.7; text-transform: uppercase; margin-top: 5px; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 18px; font-weight: 600; color: #FFFFFF; margin-bottom: 12px; }
    .paragraph { font-size: 14px; line-height: 1.6; color: rgba(255, 248, 236, 0.85); margin: 0 0 20px 0; }
    .card { background: rgba(233, 165, 52, 0.07); border: 1px solid rgba(233, 165, 52, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0; }
    .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #FFD57E; margin: 0 0 14px 0; border-bottom: 1px solid rgba(233, 165, 52, 0.2); padding-bottom: 8px; }
    .item-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed rgba(233, 165, 52, 0.1); }
    .item-label { color: rgba(255, 248, 236, 0.65); }
    .item-value { color: #FFF8EC; font-weight: 600; text-align: right; }
    .note-box { font-size: 12px; line-height: 1.6; background: rgba(0,0,0,0.3); border-left: 3px solid #E9A534; padding: 12px 14px; margin: 20px 0; color: rgba(255, 248, 236, 0.75); border-radius: 0 6px 6px 0; }
    .btn-wrap { text-align: center; margin: 28px 0 10px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #E9A534 0%, #DDA520 100%); color: #3C080D; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 13px 28px; border-radius: 50px; box-shadow: 0 6px 20px rgba(233, 165, 52, 0.3); }
    .footer { padding: 22px 24px; background-color: #100103; border-top: 1px solid rgba(233, 165, 52, 0.1); text-align: center; font-size: 11px; color: rgba(255, 248, 236, 0.45); line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo-text">Cosmic Nidhi</h1>
        <div class="tagline">Vedic Astrology &bull; Life Guidance</div>
      </div>
      <div class="content">
        <div class="greeting">${greeting}</div>
        <p class="paragraph">${intro}</p>
        
        <div class="card">
          <div class="card-title">Consultation Details</div>
          ${detailsList.map(item => `
            <div class="item-row">
              <span class="item-label">${item.label}:</span>
              <span class="item-value">${item.value}</span>
            </div>
          `).join('')}
        </div>

        ${note ? `<div class="note-box"><strong>Preparation Note:</strong> ${note}</div>` : ''}

        ${actionText && actionUrl ? `
          <div class="btn-wrap">
            <a href="${actionUrl}" class="btn">${actionText}</a>
          </div>
        ` : ''}
      </div>
      <div class="footer">
        &copy; 2026 Cosmic Nidhi. Guided by Astrologer Nidhi Asthana.<br>
        May celestial wisdom bring peace and clarity to your journey.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send appointment booking confirmation email
 */
const sendAppointmentConfirmationEmail = async (booking) => {
  const recipientEmail = booking.clientDetails?.email || (booking.user && booking.user.email);
  if (!recipientEmail) return false;

  const recipientName = booking.clientDetails?.name || (booking.user && booking.user.name) || 'Seeker';
  const bookingDate = booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Scheduled Date';

  const detailsList = [
    { label: 'Booking Reference', value: `#${booking._id ? String(booking._id).slice(-6).toUpperCase() : 'PENDING'}` },
    { label: 'Service', value: booking.serviceName || 'Astrology Consultation' },
    { label: 'Consultation Date', value: bookingDate },
    { label: 'Time Slot', value: booking.time || '10:00 AM' },
    { label: 'Duration', value: booking.duration || '60 mins' },
    { label: 'Consultant', value: 'Astrologer Nidhi Asthana' },
    { label: 'Status', value: String(booking.status || 'Confirmed').toUpperCase() },
  ];

  if (booking.amount) {
    detailsList.push({ label: 'Amount', value: `₹${booking.amount} (${booking.paymentStatus || 'pending'})` });
  }

  const html = getEmailTemplate({
    title: 'Consultation Confirmed - Cosmic Nidhi',
    greeting: `Namaste ${recipientName},`,
    intro: `Your reading session has been scheduled with Astrologer Nidhi Asthana. We are honored to accompany you on your path of self-discovery and celestial alignment.`,
    detailsList,
    note: `Please keep your exact date of birth, time of birth (with am/pm), and place of birth ready. Our team or astrologer will connect with you via your registered phone number / WhatsApp before the call.`,
    actionText: 'View in My Dashboard',
    actionUrl: 'https://cosmic-nidhi-frontend.onrender.com/dashboard',
  });

  const text = `Namaste ${recipientName},\n\nYour consultation "${booking.serviceName}" has been scheduled for ${bookingDate} at ${booking.time}.\n\nReference: #${String(booking._id).slice(-6).toUpperCase()}\nConsultant: Astrologer Nidhi Asthana\n\nBlessings,\nCosmic Nidhi`;

  return await sendCosmicEmail({
    to: recipientEmail,
    subject: `Consultation Confirmed: ${booking.serviceName} with Cosmic Nidhi`,
    html,
    text,
  });
};

/**
 * Send appointment rescheduled email
 */
const sendAppointmentRescheduledEmail = async (booking) => {
  const recipientEmail = booking.clientDetails?.email || (booking.user && booking.user.email);
  if (!recipientEmail) return false;

  const recipientName = booking.clientDetails?.name || (booking.user && booking.user.name) || 'Seeker';
  const bookingDate = booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Rescheduled Date';

  const detailsList = [
    { label: 'Booking Reference', value: `#${booking._id ? String(booking._id).slice(-6).toUpperCase() : 'PENDING'}` },
    { label: 'Service', value: booking.serviceName || 'Astrology Consultation' },
    { label: 'New Date', value: bookingDate },
    { label: 'New Time Slot', value: booking.time || '10:00 AM' },
    { label: 'Duration', value: booking.duration || '60 mins' },
    { label: 'Consultant', value: 'Astrologer Nidhi Asthana' },
    { label: 'Status', value: 'RESCHEDULED' },
  ];

  const html = getEmailTemplate({
    title: 'Consultation Rescheduled - Cosmic Nidhi',
    greeting: `Namaste ${recipientName},`,
    intro: `Your consultation schedule with Astrologer Nidhi Asthana has been updated. Below are your revised appointment details:`,
    detailsList,
    note: `If you have any questions or this updated slot does not work for you, you can reschedule again from your dashboard or contact our support team.`,
    actionText: 'Manage Booking in Dashboard',
    actionUrl: 'https://cosmic-nidhi-frontend.onrender.com/dashboard',
  });

  const text = `Namaste ${recipientName},\n\nYour consultation has been rescheduled to ${bookingDate} at ${booking.time}.\n\nReference: #${String(booking._id).slice(-6).toUpperCase()}\n\nBlessings,\nCosmic Nidhi`;

  return await sendCosmicEmail({
    to: recipientEmail,
    subject: `Consultation Rescheduled: ${booking.serviceName} - Cosmic Nidhi`,
    html,
    text,
  });
};

/**
 * Send appointment reminder email (e.g. 24h before or on the morning of)
 */
const sendAppointmentReminderEmail = async (booking) => {
  const recipientEmail = booking.clientDetails?.email || (booking.user && booking.user.email);
  if (!recipientEmail) return false;

  const recipientName = booking.clientDetails?.name || (booking.user && booking.user.name) || 'Seeker';
  const bookingDate = booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Upcoming Date';

  const detailsList = [
    { label: 'Service', value: booking.serviceName || 'Astrology Consultation' },
    { label: 'Scheduled Date', value: bookingDate },
    { label: 'Time Slot', value: booking.time || '10:00 AM' },
    { label: 'Duration', value: booking.duration || '60 mins' },
    { label: 'Consultant', value: 'Astrologer Nidhi Asthana' },
    { label: 'Booking Ref', value: `#${booking._id ? String(booking._id).slice(-6).toUpperCase() : ''}` },
  ];

  const html = getEmailTemplate({
    title: 'Reminder: Upcoming Consultation - Cosmic Nidhi',
    greeting: `Namaste ${recipientName},`,
    intro: `This is a gentle reminder that your consultation session with Astrologer Nidhi Asthana is scheduled soon.`,
    detailsList,
    note: `Please ensure you are in a quiet, undisturbed space during your reading. Have your specific questions, birth chart details, and any notes handy.`,
    actionText: 'View Dashboard',
    actionUrl: 'https://cosmic-nidhi-frontend.onrender.com/dashboard',
  });

  const text = `Namaste ${recipientName},\n\nReminder: Your consultation "${booking.serviceName}" is scheduled for ${bookingDate} at ${booking.time}.\n\nBlessings,\nCosmic Nidhi`;

  return await sendCosmicEmail({
    to: recipientEmail,
    subject: `Reminder: Your Consultation on ${bookingDate} at ${booking.time} - Cosmic Nidhi`,
    html,
    text,
  });
};

module.exports = {
  sendVerificationOTP,
  sendAppointmentConfirmationEmail,
  sendAppointmentRescheduledEmail,
  sendAppointmentReminderEmail,
};
