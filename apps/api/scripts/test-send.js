// Quick SendGrid send test. Usage:
// node apps/api/scripts/test-send.js
// Optional overrides: `TEST_SEND_TO` or set values in `apps/api/.env`.
const path = require('path');
const dotenv = require('dotenv');

// Load package-level .env (apps/api/.env)
const envPath = path.resolve(__dirname, '..', '.env');
console.log('Loading env from', envPath);
dotenv.config({ path: envPath });

// Only log presence of secrets to avoid leaking values
console.log('SENDGRID_API_KEY present:', !!process.env.SENDGRID_API_KEY);
const apiKey = process.env.SENDGRID_API_KEY || '';
if (!apiKey) {
  console.error('SENDGRID_API_KEY not set in environment. Aborting test.');
  process.exit(2);
}
try {
  const sg = require('@sendgrid/mail');
  sg.setApiKey(apiKey);
  (async () => {
    try {
      const res = await sg.send({
        to: process.env.TEST_SEND_TO || process.env.NOTIFY_EMAIL || 'you@example.com',
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        subject: 'SendGrid test from local dev',
        text: 'This is a test message from the local SendGrid test script.',
      });
      console.log('SendGrid send result:', res && res.length ? res[0].statusCode : res);
      if (res && res.length && res[0].headers) console.log('Response headers:', res[0].headers);
      process.exit(0);
    } catch (e) {
      console.error('Send failed:', e && e.message ? e.message : e);
      if (e && e.response && e.response.body)
        console.error('Response body:', JSON.stringify(e.response.body));
      process.exit(3);
    }
  })();
} catch (err) {
  console.error(
    "@sendgrid/mail not installed or couldn't be required:",
    err && err.message ? err.message : err,
  );
  process.exit(4);
}
