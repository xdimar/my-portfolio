import nodemailer from 'nodemailer';

export interface EmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendNotificationEmail(
  payload: EmailPayload
): Promise<{ success: boolean; method?: string; error?: string }> {
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'ddimar74@gmail.com';
  const gmailUser = process.env.GMAIL_USER || 'ddimar74@gmail.com';
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  const resendApiKey = process.env.RESEND_API_KEY;

  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Jakarta',
  }).format(now);

  const subjectLine = `⚡ [Pesan Baru Portofolio] ${payload.subject || 'Kolaborasi / Diskusi'} - ${payload.name}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pesan Portofolio Masuk</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Container Card -->
        <table role="presentation" width="100%" style="max-width: 600px; background: #111827; border: 1px solid #1f293d; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Cyber Header -->
          <tr>
            <td style="background: linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(157, 78, 221, 0.15) 100%); padding: 25px 30px; border-bottom: 1px solid rgba(0, 242, 254, 0.2);">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #00f2fe; text-transform: uppercase; margin-bottom: 6px;">
                ⚡ PORTFOLIO TELEMETRY INBOX
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">
                Pesan Kontak Masuk Baru
              </h1>
              <div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">
                Diterima pada: <span style="color: #e5e7eb;">${formattedDate} WIB</span>
              </div>
            </td>
          </tr>

          <!-- Sender Details Grid -->
          <tr>
            <td style="padding: 24px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #1a2234; border-radius: 10px; border: 1px solid #23304a; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #23304a;">
                    <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Pengirim:</span><br>
                    <strong style="font-size: 16px; color: #ffffff;">${escapeHtml(payload.name)}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #23304a;">
                    <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Alamat Email:</span><br>
                    <a href="mailto:${payload.email}" style="color: #00f2fe; text-decoration: none; font-size: 15px; font-weight: 600;">${escapeHtml(payload.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px;">
                    <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Subjek Pesan:</span><br>
                    <span style="font-size: 15px; color: #f3f4f6; font-weight: 600;">${escapeHtml(payload.subject || 'Tanpa Subjek')}</span>
                  </td>
                </tr>
              </table>

              <!-- Message Body -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600;">
                  Isi Pesan:
                </div>
                <div style="background: #0d121f; border-left: 3px solid #10b981; border-radius: 0 8px 8px 0; padding: 18px 20px; font-size: 15px; line-height: 1.65; color: #e5e7eb; white-space: pre-wrap; font-family: inherit;">${escapeHtml(payload.message)}</div>
              </div>

              <!-- Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <a href="mailto:${payload.email}?subject=Re:%20${encodeURIComponent(payload.subject || 'Portfolio Inquiry')}" 
                       style="display: inline-block; background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); color: #000000; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-right: 10px; margin-bottom: 10px;">
                      ✉️ Balas Langsung ke Pengirim
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #0c101c; padding: 16px 30px; text-align: center; border-top: 1px solid #1f293d; font-size: 12px; color: #6b7280;">
              Notifikasi otomatis sistem portofolio Muhammad Jihan Dimar &bull; SMK NU Sunan Ampel Poncokusumo (TKJ 2021)
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 1. Cek Nodemailer dengan Gmail App Password
  if (gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass.replace(/\s+/g, ''), // Bersihkan spasi jika disalin dalam format 4x4
        },
      });

      await transporter.sendMail({
        from: `"Portofolio Dimar" <${gmailUser}>`,
        to: targetEmail,
        replyTo: `"${payload.name}" <${payload.email}>`,
        subject: subjectLine,
        text: `Pesan baru dari ${payload.name} (${payload.email}):\n\nSubjek: ${payload.subject}\n\n${payload.message}`,
        html: htmlContent,
      });

      console.log(`[Email Service] Notifikasi berhasil dikirim via Gmail SMTP ke ${targetEmail}`);
      return { success: true, method: 'gmail-smtp' };
    } catch (smtpErr: unknown) {
      const errorMsg = smtpErr instanceof Error ? smtpErr.message : String(smtpErr);
      console.error('[Email Service] Gagal mengirim via Gmail SMTP:', errorMsg);
    }
  }

  // 2. Cek Resend API jika API Key tersedia
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Portfolio Dimar <onboarding@resend.dev>',
          to: [targetEmail],
          reply_to: payload.email,
          subject: subjectLine,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        console.log(`[Email Service] Notifikasi berhasil dikirim via Resend ke ${targetEmail}`);
        return { success: true, method: 'resend-api' };
      } else {
        const resText = await res.text();
        console.error('[Email Service] Resend API error:', resText);
      }
    } catch (resendErr: unknown) {
      const errorMsg = resendErr instanceof Error ? resendErr.message : String(resendErr);
      console.error('[Email Service] Gagal mengirim via Resend:', errorMsg);
    }
  }

  // 3. Fallback jika kredensial belum diset di .env.local
  console.log(`
================================================================================
⚡ [NOTIFIKASI PESAN PORTOFOLIO MASUK UNTUK: ${targetEmail}]
Waktu: ${formattedDate} WIB
Pengirim: ${payload.name} (${payload.email})
Subjek: ${payload.subject || '-'}
Pesan: ${payload.message}

💡 INFO PENGATURAN EMAIL:
Untuk menerima email otomatis langsung ke Inbox Gmail Anda (${targetEmail}):
Tambahkan ke file .env.local:
GMAIL_USER=${targetEmail}
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  (Buat di Akun Google > Keamanan > Sandi Aplikasi)
================================================================================
`);

  return { success: false, error: 'Credentials not configured, logged to console' };
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
