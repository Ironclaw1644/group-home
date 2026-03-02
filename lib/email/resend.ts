import 'server-only';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
};

function requiredEnv(name: 'RESEND_API_KEY' | 'RESEND_FROM') {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function stripHtml(input: string) {
  return input.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function sendResendEmail(input: SendEmailInput) {
  const apiKey = requiredEnv('RESEND_API_KEY');
  const from = input.from || requiredEnv('RESEND_FROM');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text || stripHtml(input.html),
      reply_to: input.replyTo || undefined
    })
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof body?.message === 'string' ? body.message : `Resend send failed (${res.status})`;
    throw new Error(message);
  }

  return body as { id?: string };
}
