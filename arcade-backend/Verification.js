// arcade-backend/Verification.js
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');

const resend   = new Resend(process.env.RESEND_API_KEY);
const SECRET   = process.env.JWT_SECRET   || 'ourSecretKey';
const FROM     = process.env.EMAIL_FROM   || 'noreply@tempclassproject.xyz';
const BASE_URL = process.env.BASE_URL     || 'http://www.tempclassproject.xyz';

async function sendVerificationEmail(toEmail) {
  if (!toEmail || typeof toEmail !== 'string') {
    throw new Error('sendVerificationEmail: a valid email address is required.');
  }

  const token      = jwt.sign({ email: toEmail }, SECRET, { expiresIn: '30m' });
  const verifyLink = `${BASE_URL}/verify-confirm?token=${token}`;

  const { data, error } = await resend.emails.send({
    from:    FROM,
    to:      [toEmail],
    subject: 'Verify your Arcade account',
    html: `
      <div style="background:#0d1b2a;padding:32px;font-family:sans-serif;color:#cbd5e1;border-radius:12px;max-width:520px;margin:auto">
        <h1 style="color:#00ffff;margin-top:0">🎮 The Arcade – Verify Your Email</h1>
        <p>Thanks for signing up! Click below to activate your account:</p>
        <a href="${verifyLink}"
           style="display:inline-block;padding:12px 28px;background:#00ffff;color:#0a0a1a;font-weight:bold;border-radius:8px;text-decoration:none;margin:16px 0">
          Verify My Email
        </a>
        <p style="color:#64748b;font-size:0.82rem">
          This link expires in 30 minutes.<br>Do not reply to this message.
        </p>
      </div>`,
    text: `Verify your Arcade account:\n${verifyLink}\n\nExpires in 30 minutes.`,
  });

  if (error) {
    console.error('[Verification] Resend error:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  console.log('[Verification] Sent to:', toEmail, '– id:', data?.id);
  return data;
}

module.exports = { sendVerificationEmail };

