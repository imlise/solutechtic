// =====================================================================
// Fonction serverless Vercel (Node.js) — remplace contact.php
// Endpoint : POST /api/contact
// Reçoit du JSON : { n: nom, e: email, s: service, m: message, website: honeypot }
// Nécessite les variables d'environnement (à définir dans Vercel > Settings > Environment Variables) :
//   SMTP_HOST     ex: mail.solutechtic.com
//   SMTP_PORT     ex: 587  (465 si SMTP_SECURE=true)
//   SMTP_SECURE   "true" ou "false"
//   SMTP_USER     info@solutechtic.com
//   SMTP_PASS     mot de passe de la boîte info@solutechtic.com
// =====================================================================

import nodemailer from 'nodemailer';

const LOGO_URL = 'https://solutechtic.com/images/logo_solutech2.png';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
  }

  try {
    const body = req.body || {};

    // Honeypot : si ce champ est rempli, c'est un bot
    if (body.website) {
      return res.status(200).json({ success: true, message: '✓ Votre demande a été envoyée.' });
    }

    const name    = (body.n ?? '').toString().trim();
    const email   = (body.e ?? '').toString().trim();
    const service = (body.s ?? '').toString().trim();
    const message = (body.m ?? '').toString().trim();

    /* ── Validation ── */
    const errors = [];
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name === '')    errors.push('Le nom est requis.');
    if (!emailOk)        errors.push('Email invalide.');
    if (service === '') errors.push('Veuillez sélectionner un service.');
    if (message === '') errors.push('Le message est requis.');

    if (errors.length > 0) {
      return res.status(422).json({ success: false, message: errors.join(' ') });
    }

    const safeName = name.replace(/[\r\n]+/g, '');
    const safeEmail = email;
    const formattedMessage = escapeHtml(message).replace(/\n/g, '<br>');

    /* ── Envoi ── */
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const dateFr = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Lome',
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date());

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4F4F7;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F7;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:10px;overflow:hidden;box-shadow:0 4px 18px rgba(3,20,57,.08);">

          <tr>
            <td style="background:#031439;padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${LOGO_URL}" alt="Solutech" width="46" height="46" style="display:block;border-radius:8px;background:#fff;padding:4px;">
                  </td>
                  <td style="vertical-align:middle;padding-left:14px;">
                    <span style="font-family:Arial,sans-serif;font-size:18px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#FFFFFF;">SOLUTECH</span><br>
                    <span style="font-family:Arial,sans-serif;font-size:9px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.5);">Innovation Group</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,#C0221E,#2563EB);">&nbsp;</td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#C0221E;">Nouveau message</p>
              <h2 style="margin:0 0 22px;font-size:20px;color:#031439;">Formulaire de contact du site</h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:22px;">
                <tr>
                  <td style="padding:10px 14px;background:#F4F4F7;border-left:3px solid #C0221E;font-size:13px;color:#031439;">
                    <strong style="color:#6B6F7E;font-weight:600;">Nom&nbsp;:</strong> ${safeName}
                  </td>
                </tr>
                <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>
                <tr>
                  <td style="padding:10px 14px;background:#F4F4F7;border-left:3px solid #2563EB;font-size:13px;color:#031439;">
                    <strong style="color:#6B6F7E;font-weight:600;">Email&nbsp;:</strong> <a href="mailto:${safeEmail}" style="color:#2563EB;text-decoration:none;">${safeEmail}</a>
                  </td>
                </tr>
                <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>
                <tr>
                  <td style="padding:10px 14px;background:#F4F4F7;border-left:3px solid #C0221E;font-size:13px;color:#031439;">
                    <strong style="color:#6B6F7E;font-weight:600;">Service&nbsp;:</strong> ${service}
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#6B6F7E;">Message</p>
              <div style="padding:16px 18px;background:#F4F4F7;border-radius:6px;font-size:14px;line-height:1.7;color:#031439;">
                ${formattedMessage}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background:#F4F4F7;border-top:1px solid #DEDFE6;">
              <p style="margin:0;font-size:11px;color:#6B6F7E;">
                Reçu le ${dateFr} via le formulaire de contact du site — Solutech Innovation Group.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text =
      `Nouveau message depuis le formulaire de contact\n\n` +
      `Nom : ${safeName}\n` +
      `Email : ${safeEmail}\n` +
      `Service : ${service}\n\n` +
      `Message :\n${message}\n\n` +
      `Reçu le ${dateFr} — Solutech Innovation Group`;

    await transporter.sendMail({
      from: `"Solutech Innovation Group" <${process.env.SMTP_USER}>`,
      to: 'info@solutechtic.com',
      replyTo: `"${safeName}" <${safeEmail}>`,
      subject: `Nouveau message depuis le formulaire de contact — ${safeName}`,
      html,
      text,
    });

    return res.status(200).json({ success: true, message: 'Mail envoyé avec succès.' });

  } catch (err) {
    console.error('[api/contact]', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du mail.',
    });
  }
}