// Run Capital Partners — contact-form handler.
// Runs as a Vercel Serverless Function pinned to the Frankfurt region (fra1,
// set via "regions" in vercel.json) so that contact-form personal data is
// received and processed inside the EU. Delivery is via Resend (EU region),
// authenticated with an API key we control — no dependency on Google Workspace
// admin settings, and no third-party form service (FormSubmit.co) in the path.
//
// Required environment variable (set in the Vercel project dashboard):
//   RESEND_API_KEY — a Resend API key (create the account in the EU region)
// Optional overrides:
//   MAIL_TO    (default info@runcapital.partners) — where submissions land
//   MAIL_FROM  (default "Run Capital Partners <noreply@runcapital.partners>")
//              — must be an address on a domain verified in Resend.
//
// Zero npm dependencies — uses the built-in fetch in Vercel's Node runtime.

const MAX = { name: 200, email: 320, company: 200, interest: 120, message: 5000 };

function clean(v, max) {
  return (typeof v === 'string' ? v : '').trim().slice(0, max);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Vercel's Node runtime parses JSON bodies into req.body automatically.
  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot — silently accept so bots get a 200 but nothing is sent.
  if (clean(body._honey, 50)) {
    return res.status(200).json({ success: true });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const company = clean(body.company, MAX.company);
  const interest = clean(body.interest, MAX.interest);
  const message = clean(body.message, MAX.message);
  const professional = body.professional_investor ? 'Yes' : 'No';

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY not configured');
    return res.status(500).json({ success: false, message: 'Mail service not configured.' });
  }

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Company', company || '—'],
    ['Interested in', interest || '—'],
    ['Professional investor', professional],
    ['Message', message],
  ];

  const html =
    '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
    rows
      .map(function (r) {
        return (
          '<tr>' +
          '<td style="padding:6px 12px;border:1px solid #ddd;background:#f7f7f7;font-weight:bold;vertical-align:top">' +
          escapeHtml(r[0]) +
          '</td>' +
          '<td style="padding:6px 12px;border:1px solid #ddd;white-space:pre-wrap">' +
          escapeHtml(r[1]) +
          '</td>' +
          '</tr>'
        );
      })
      .join('') +
    '</table>';

  const text = rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || 'Run Capital Partners <noreply@runcapital.partners>',
        to: [process.env.MAIL_TO || 'info@runcapital.partners'],
        reply_to: name + ' <' + email + '>',
        subject: 'New inquiry from runcapital.partners',
        text: text,
        html: html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('contact: Resend error', r.status, detail);
      return res.status(502).json({ success: false, message: 'Could not send your message. Please email us directly.' });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('contact: send failed', err && err.message);
    return res.status(502).json({ success: false, message: 'Could not send your message. Please email us directly.' });
  }
};
