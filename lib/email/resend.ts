import 'server-only';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
};

export class ResendSendError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function requiredEnv(name: 'RESEND_API_KEY' | 'RESEND_FROM') {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export function getMissingResendEnvVars() {
  const required = ['RESEND_API_KEY', 'RESEND_FROM'] as const;
  return required.filter((name) => !process.env[name]?.trim());
}

export function normalizeResendFrom(raw: string) {
  const trimmed = raw.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1).trim()
      : trimmed;
  return unquoted;
}

export function isValidResendFrom(value: string) {
  const plainEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameAddress = /^[^<>]+<\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*>$/;
  return plainEmail.test(value) || nameAddress.test(value);
}

export function resolveResendFrom() {
  const value = normalizeResendFrom(requiredEnv('RESEND_FROM'));
  if (!isValidResendFrom(value)) {
    throw new Error('Invalid RESEND_FROM format. Use "Name <email@domain>" or "email@domain" without wrapping quotes.');
  }
  return value;
}

function stripHtml(input: string) {
  return input.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function sendResendEmail(input: SendEmailInput) {
  const apiKey = requiredEnv('RESEND_API_KEY');
  const from = normalizeResendFrom(input.from || resolveResendFrom());
  if (!isValidResendFrom(from)) {
    throw new Error('Invalid RESEND_FROM format. Use "Name <email@domain>" or "email@domain" without wrapping quotes.');
  }
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
    throw new ResendSendError(message, res.status, body);
  }

  return body as { id?: string };
}
