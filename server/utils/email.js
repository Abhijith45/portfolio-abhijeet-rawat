const nodemailer = require('nodemailer');

// Target recipient specified by user
const DEFAULT_RECEIVER = 'abhijeetrawat45@gmail.com';

/**
 * Creates and returns an active Nodemailer transporter.
 * Supports Gmail / custom SMTP, with automatic Ethereal fallback for dev/testing when credentials are not yet set.
 */
async function getTransporter() {
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (user && pass) {
        if (process.env.SMTP_HOST) {
            return nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user, pass },
            });
        }
        // Default to Gmail service
        return nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });
    }

    // Dev / Test Mode: Create Ethereal test account if credentials not set
    console.log('[Email] No SMTP credentials found in .env. Creating test account via Ethereal...');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
}

/**
 * Sends inquiry notification email to abhijeetrawat45@gmail.com
 * @param {Object} query
 * @param {string} query.name
 * @param {string} query.email
 * @param {string} query.message
 * @param {Date|string} query.createdAt
 */
async function sendInquiryNotification({ name, email, message, subject: mailSubject = 'Enquiry Mail', createdAt = new Date() }) {
    try {
        const receiver = process.env.CONTACT_RECEIVER_EMAIL || DEFAULT_RECEIVER;
        const transporter = await getTransporter();

        const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || '"Portfolio Terminal" <noreply@abhijeetrawat.dev>';
        const formattedDate = new Date(createdAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        const activeSubject = mailSubject || 'Enquiry Mail';
        const emailSubject = `${activeSubject} - from ${name}`;

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050608; color: #e6edf3; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background-color: #0b0f17; border: 1px solid rgba(0, 255, 65, 0.25); border-radius: 10px; padding: 28px; box-shadow: 0 4px 30px rgba(0, 255, 65, 0.08); }
            .header { border-bottom: 1px solid rgba(0, 255, 65, 0.2); padding-bottom: 16px; margin-bottom: 20px; }
            .badge { font-family: monospace; color: #00FF41; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
            .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 8px 0 4px; }
            .timestamp { font-size: 12px; color: #8b949e; font-family: monospace; }
            .field-label { font-family: monospace; color: #00FF41; font-size: 11px; letter-spacing: 1px; margin-top: 18px; margin-bottom: 6px; text-transform: uppercase; }
            .field-value { background: #04060a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; padding: 12px 14px; font-size: 14px; color: #ffffff; word-break: break-word; }
            .message-box { background: #04060a; border: 1px solid rgba(0, 255, 65, 0.2); border-radius: 6px; padding: 14px; font-size: 14px; line-height: 1.6; color: #d1d5db; white-space: pre-wrap; }
            .btn { display: inline-block; background-color: #00FF41; color: #000000 !important; font-family: monospace; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin-top: 24px; font-size: 13px; letter-spacing: 1px; }
            .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; color: #6e7681; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="badge">// INCOMING TRANSMISSION</div>
              <div class="title">${activeSubject}</div>
              <div class="timestamp">Received: ${formattedDate}</div>
            </div>
            
            <div class="field-label">01. Sender Identity</div>
            <div class="field-value">${name}</div>

            <div class="field-label">02. Return Address</div>
            <div class="field-value"><a href="mailto:${email}" style="color: #00FF41; text-decoration: none;">${email}</a></div>

            <div class="field-label">03. Project Description / Message</div>
            <div class="message-box">${message}</div>

            <a href="mailto:${email}?subject=Re:%20Inquiry%20regarding%20your%20project" class="btn">REPLY VIA EMAIL &rarr;</a>

            <div class="footer">
              Dispatched automatically to ${receiver} from Abhijeet Rawat's Portfolio System.
            </div>
          </div>
        </body>
        </html>
        `;

        const info = await transporter.sendMail({
            from: fromAddress,
            to: receiver,
            replyTo: email,
            subject: emailSubject,
            text: `[${activeSubject}]\n\nFrom: ${name} (${email})\nDate: ${formattedDate}\n\nMessage:\n${message}\n\nReply directly to: ${email}`,
            html: htmlContent,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`[Email] Notification sent successfully! MessageId: ${info.messageId}`);
        if (previewUrl) {
            console.log(`[Email] Test Email Preview URL: ${previewUrl}`);
        }

        return {
            success: true,
            messageId: info.messageId,
            previewUrl: previewUrl || null,
        };
    } catch (error) {
        console.error('[Email] Failed to send email notification:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

module.exports = {
    sendInquiryNotification,
    DEFAULT_RECEIVER,
};
