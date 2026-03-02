import 'server-only';

import { business } from '@/lib/content';

function renderBodyHtml(body: string) {
  const lines = body.split(/\r?\n/);
  const chunks: string[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    chunks.push(`<ul style="margin:0 0 16px 20px;padding:0;">${list.map((item) => `<li style=\"margin:0 0 8px 0;\">${item}</li>`).join('')}</ul>`);
    list = [];
  };

  for (const line of lines) {
    const text = line.trim();
    if (!text) {
      flushList();
      continue;
    }
    if (/^[-*]\s+/.test(text)) {
      list.push(text.replace(/^[-*]\s+/, ''));
      continue;
    }
    flushList();
    chunks.push(`<p style="margin:0 0 16px 0;line-height:1.6;">${text}</p>`);
  }
  flushList();

  return chunks.join('');
}

export function renderMarketingEmail(input: {
  subject: string;
  previewText?: string;
  body: string;
  unsubscribeUrl: string;
}) {
  const bodyHtml = renderBodyHtml(input.body);
  const preview = input.previewText ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${input.previewText}</div>` : '';

  return `${preview}
  <div style="background:#f5f1ea;padding:24px;font-family:Arial,sans-serif;color:#0f2d45;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d9e3e8;border-radius:16px;overflow:hidden;">
      <div style="padding:20px 24px;background:linear-gradient(135deg,#0f2d45 0%,#0c9ea6 100%);color:#ffffff;">
        <div style="font-size:20px;font-weight:700;">At Home Family Services, LLC</div>
      </div>
      <div style="padding:24px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;color:#0f2d45;">${input.subject}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:20px 24px;border-top:1px solid #e8eef1;background:#f8fbfc;font-size:13px;line-height:1.6;color:#315069;">
        <div>${business.phone}</div>
        <div>${business.email}</div>
        <div>${business.address}</div>
        <div><a href="${business.instagram}" style="color:#0c9ea6;text-decoration:none;">Instagram</a> · <a href="https://athomefamilyservices.com" style="color:#0c9ea6;text-decoration:none;">Website</a></div>
        <div style="margin-top:12px;"><a href="${input.unsubscribeUrl}" style="color:#0c9ea6;">Unsubscribe</a></div>
      </div>
    </div>
  </div>`;
}
