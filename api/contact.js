import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, phone, subject, message } = req.body || {};

  if (!email || !message) {
    res.status(400).json({ error: 'Email and message are required' });
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: `Augusta Rugby Website <contact@${process.env.RESEND_EMAIL_DOMAIN}>`,
      to: ['admin@augustarugby.org'],
      replyTo: email,
      subject: subject ? `[Website] ${subject}` : 'New message from augustarugby.org',
      text: `Name: ${name || '(not provided)'}\nEmail: ${email}\nPhone: ${phone || '(not provided)'}\n\n${message}`,
    });

    if (error) {
      res.status(502).json({ error: 'Failed to send message' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
}
