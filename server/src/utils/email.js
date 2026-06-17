import nodemailer from 'nodemailer';
import config from '../config/index.js';

/**
 * Create a reusable transporter.
 * In development, falls back to console logging if SMTP is not configured.
 */
function getTransporter() {
  const { host, port, user, pass } = config.smtp;

  if (!host || !user) {
    // Dev fallback: log emails to console
    return {
      sendMail: async (options) => {
        console.log('\n📧 Email would be sent:');
        console.log('  To:', options.to);
        console.log('  Subject:', options.subject);
        console.log('  Body:', options.text || options.html?.slice(0, 200));
        console.log('');
        return { messageId: 'dev-' + Date.now() };
      },
    };
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Send a notification email when a new contact form lead is submitted.
 */
export async function sendLeadNotification(lead, sportName) {
  const transporter = getTransporter();

  if (!config.notificationEmail) {
    console.warn('NOTIFICATION_EMAIL not set, skipping email notification');
    return;
  }

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1B5E20; padding: 20px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">${config.brandName}</h1>
        <p style="color: #E3E7E1; margin: 8px 0 0;">New Lead Received</p>
      </div>
      <div style="padding: 24px; background: #F7F8F6; border: 1px solid #DDE2DC;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1A1F1B; width: 140px;">Name:</td>
            <td style="padding: 8px 0; color: #1A1F1B;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1A1F1B;">Phone:</td>
            <td style="padding: 8px 0; color: #1A1F1B;">
              <a href="tel:${lead.phone}" style="color: #0D47A1;">${lead.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1A1F1B;">Sport of Interest:</td>
            <td style="padding: 8px 0; color: #1A1F1B;">${sportName || 'Not specified'}</td>
          </tr>
          ${
            lead.message
              ? `<tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1A1F1B; vertical-align: top;">Message:</td>
            <td style="padding: 8px 0; color: #1A1F1B;">${lead.message}</td>
          </tr>`
              : ''
          }
        </table>
      </div>
      <div style="padding: 16px; text-align: center; color: #5A6259; font-size: 13px;">
        <p>This lead was submitted via the website contact form.</p>
        <p>Log in to the <a href="${config.siteUrl}/admin/leads" style="color: #0D47A1;">Admin Dashboard</a> to manage leads.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${config.brandName}" <${config.smtp.user || 'noreply@academy.com'}>`,
      to: config.notificationEmail,
      subject: `New Enquiry: ${lead.name} — ${sportName || 'General'}`,
      html,
      text: `New lead from ${lead.name}\nPhone: ${lead.phone}\nSport: ${sportName || 'Not specified'}\nMessage: ${lead.message || 'N/A'}`,
    });
  } catch (error) {
    console.error('Failed to send lead notification email:', error);
    // Don't throw — email failure shouldn't block the form submission response
  }
}
