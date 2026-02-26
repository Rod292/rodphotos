import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml({ name, email, phone, message }) {
  const phoneRow = phone?.trim()
    ? `<tr>
        <td style="padding:6px 12px;color:#a1a1aa;font-size:13px;white-space:nowrap;vertical-align:top;">Téléphone</td>
        <td style="padding:6px 12px;color:#f4f4f5;font-size:14px;">${escapeHtml(phone)}</td>
      </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#18181b;border-radius:12px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 20px;border-bottom:1px solid #27272a;">
            <span style="font-size:22px;font-weight:300;color:#f4f4f5;letter-spacing:-0.5px;">ROD</span>
            <span style="float:right;font-size:12px;color:#71717a;line-height:28px;">Nouveau message</span>
          </td>
        </tr>
        <!-- Contact info -->
        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#27272a;border-radius:8px;">
              <tr>
                <td style="padding:6px 12px;color:#a1a1aa;font-size:13px;white-space:nowrap;vertical-align:top;">Nom</td>
                <td style="padding:6px 12px;color:#f4f4f5;font-size:14px;font-weight:500;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;color:#a1a1aa;font-size:13px;white-space:nowrap;vertical-align:top;">Email</td>
                <td style="padding:6px 12px;">
                  <a href="mailto:${escapeHtml(email)}" style="color:#60a5fa;font-size:14px;text-decoration:none;">${escapeHtml(email)}</a>
                </td>
              </tr>
              ${phoneRow}
            </table>
          </td>
        </tr>
        <!-- Message -->
        <tr>
          <td style="padding:0 32px 32px;">
            <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#71717a;">Message</p>
            <div style="padding:16px;background-color:#09090b;border-radius:8px;border:1px solid #27272a;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:#d4d4d8;white-space:pre-wrap;">${escapeHtml(message)}</p>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #27272a;text-align:center;">
            <p style="margin:0;font-size:11px;color:#52525b;">Envoyé depuis photosrod.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const phoneLine = phone?.trim() ? `\nTéléphone: ${phone}` : '';

    const { data, error: sendError } = await resend.emails.send({
      from: 'ROD Photos <contact@photosrod.com>',
      to: 'contact@photosrod.com',
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      text: `Nom: ${name}\nEmail: ${email}${phoneLine}\n\nMessage:\n${message}`,
      html: buildHtml({ name, email, phone, message }),
    });

    if (sendError) {
      console.error('Resend API error:', sendError);
      return NextResponse.json(
        { error: sendError.message || 'Erreur envoi email' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data?.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
