import { Resend } from 'resend';

interface ContactRequestBody {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
}

interface VercelRequest {
  method?: string;
  body?: ContactRequestBody | string;
}

interface VercelResponse {
  status: (code: number) => {
    json: (data: unknown) => void;
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: 'Email service is not configured (missing RESEND_API_KEY).',
    });
  }

  let body: ContactRequestBody = {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body) as ContactRequestBody;
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid JSON payload.' });
    }
  } else if (req.body && typeof req.body === 'object') {
    body = req.body;
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const company = body.company?.trim() || 'N/A';
  const message = body.message?.trim() ?? '';

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required.',
    });
  }

  const resend = new Resend(apiKey);
  const fromAddress =
    process.env.RESEND_FROM_EMAIL || 'Renaissance Events <noreply@renaissanceevents.com>';

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const siteUrl = (process.env.SITE_URL || 'https://renaissanceevents.com').replace(/\/$/, '');
  const logoUrl = `${siteUrl}/images/logo.png`;

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: ['info@renaissanceevents.com'],
    replyTo: email,
    subject: `New Event Inquiry from ${name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New Event Inquiry</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 36px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #06369c; background: linear-gradient(160deg, #06369c 0%, #04256e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.18);">
                  <!-- Header with Left-Aligned Logo -->
                  <tr>
                    <td style="padding: 28px 32px 24px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.18);">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="left" valign="middle">
                            <img
                              src="${logoUrl}"
                              alt="Renaissance Meetings & Special Events, Inc."
                              width="165"
                              style="display: block; max-width: 165px; height: auto; border: 0;"
                            />
                          </td>
                          <td align="right" valign="middle">
                            <span style="display: inline-block; padding: 6px 14px; border-radius: 999px; background-color: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.3); color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase;">
                              New Event Inquiry
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 28px 32px 28px 32px;">
                      <p style="margin: 0 0 22px 0; font-size: 15px; line-height: 1.6; color: rgba(255, 255, 255, 0.85);">
                        You have received a new inquiry from the <strong style="color: #ffffff;">Renaissance Events</strong> website.
                      </p>

                      <!-- Details Card (Blue glassmorphic style with white text) -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; overflow: hidden; margin-bottom: 22px;">
                        <tr>
                          <td style="padding: 14px 18px; width: 115px; background-color: rgba(255, 255, 255, 0.06); border-bottom: 1px solid rgba(255, 255, 255, 0.14); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255, 255, 255, 0.72);">
                            Name
                          </td>
                          <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.14); font-size: 15px; font-weight: 600; color: #ffffff;">
                            ${safeName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 18px; width: 115px; background-color: rgba(255, 255, 255, 0.06); border-bottom: 1px solid rgba(255, 255, 255, 0.14); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255, 255, 255, 0.72);">
                            Email
                          </td>
                          <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.14); font-size: 15px;">
                            <a href="mailto:${safeEmail}" style="color: #ffffff; font-weight: 600; text-decoration: underline;">${safeEmail}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 18px; width: 115px; background-color: rgba(255, 255, 255, 0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255, 255, 255, 0.72);">
                            Company
                          </td>
                          <td style="padding: 14px 18px; font-size: 15px; color: #ffffff;">
                            ${safeCompany}
                          </td>
                        </tr>
                      </table>

                      <!-- Message Box -->
                      <div style="background-color: rgba(255, 255, 255, 0.1); border-left: 4px solid #ffffff; border-radius: 0 12px 12px 0; padding: 18px 20px; margin-bottom: 28px;">
                        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255, 255, 255, 0.75); margin-bottom: 8px;">
                          Message
                        </div>
                        <div style="font-size: 15px; line-height: 1.65; color: #ffffff;">
                          ${safeMessage}
                        </div>
                      </div>

                      <!-- White Reply CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="border-radius: 999px; background-color: #ffffff;">
                            <a
                              href="mailto:${safeEmail}?subject=Re:%20Your%20Renaissance%20Events%20Inquiry"
                              style="display: inline-block; padding: 13px 28px; font-size: 12px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: #06369c; text-decoration: none;"
                            >
                              Reply to ${safeName}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="left" style="padding: 18px 32px; background-color: rgba(0, 0, 0, 0.16); border-top: 1px solid rgba(255, 255, 255, 0.14);">
                      <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.72);">
                        Renaissance Meetings &amp; Special Events, Inc. &bull; Automated Website Inquiry
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `New Event Inquiry\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`,
  });

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email via Resend.',
    });
  }

  return res.status(200).json({ success: true, id: data?.id });
}
