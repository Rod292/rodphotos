import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_LENGTHS = { name: 100, email: 254, phone: 30, message: 5000 };
// Un humain met plus de 3 s à remplir le formulaire ; les bots soumettent instantanément
const MIN_FILL_TIME_MS = 3000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const ALLOWED_HOSTS = ['photosrod.com', 'www.photosrod.com', 'localhost'];

// Best-effort sur serverless : la Map vit le temps d'une instance chaude,
// suffisant pour bloquer les rafales d'un même bot
const submissionsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  for (const [key, timestamps] of submissionsByIp) {
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) submissionsByIp.delete(key);
    else submissionsByIp.set(key, recent);
  }
  const attempts = submissionsByIp.get(ip) || [];
  if (attempts.length >= RATE_LIMIT_MAX) return true;
  submissionsByIp.set(ip, [...attempts, now]);
  return false;
}

function isFromAllowedOrigin(request) {
  const origin = request.headers.get('origin');
  // Absence d'Origin : on laisse les autres protections trancher
  if (!origin) return true;
  try {
    return ALLOWED_HOSTS.includes(new URL(origin).hostname);
  } catch {
    return false;
  }
}

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
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      console.log('[contact] blocked: rate limit', ip);
      return NextResponse.json(
        { error: 'Trop de messages envoyés. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
    }
    const { website, elapsed } = body;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    // Détection de bots : on renvoie un faux succès sans envoyer d'email,
    // pour ne pas leur indiquer que la soumission a été bloquée
    if (website) {
      console.log('[contact] blocked: honeypot', ip);
      return NextResponse.json({ success: true });
    }
    if (typeof elapsed !== 'number' || elapsed < MIN_FILL_TIME_MS) {
      console.log('[contact] blocked: too fast or missing elapsed', ip, elapsed);
      return NextResponse.json({ success: true });
    }
    if (!isFromAllowedOrigin(request)) {
      console.log('[contact] blocked: bad origin', ip, request.headers.get('origin'));
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_LENGTHS.name ||
      email.length > MAX_LENGTHS.email ||
      phone.length > MAX_LENGTHS.phone ||
      message.length > MAX_LENGTHS.message
    ) {
      return NextResponse.json(
        { error: 'Un des champs dépasse la longueur maximale autorisée' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
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
