import 'server-only';

import { business } from '@/lib/content';

const LOGO_URL = 'https://athomefamilyservices.com/brand/AHFS_logo.png';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
      list.push(escapeHtml(text.replace(/^[-*]\s+/, '')));
      continue;
    }
    flushList();
    chunks.push(`<p style="margin:0 0 16px 0;line-height:1.6;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(text)}</p>`);
  }
  flushList();

  return chunks.join('');
}

function renderEmailShell(input: {
  title: string;
  previewText?: string;
  contentHtml: string;
  unsubscribeUrl: string;
}) {
  const preview = input.previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.previewText)}</div>`
    : '';

  return `${preview}
  <div style="background:#f5f1ea;padding:24px;font-family:Arial,sans-serif;color:#0f2d45;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d9e3e8;border-radius:16px;overflow:hidden;">
      <div style="padding:18px 24px;background:linear-gradient(135deg,#0f2d45 0%,#0c9ea6 100%);color:#ffffff;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          <tr>
            <td width="52" valign="middle" style="padding:0;">
              <img src="${LOGO_URL}" alt="AHFS Logo" width="42" height="42" style="display:block;border:0;border-radius:999px;background:#fff;padding:2px;" />
            </td>
            <td valign="middle" style="padding:0 0 0 8px;font-size:20px;font-weight:700;">At Home Family Services, LLC</td>
          </tr>
        </table>
      </div>
      <div style="padding:24px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;color:#0f2d45;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(input.title)}</h1>
        ${input.contentHtml}
      </div>
      <div style="padding:20px 24px;border-top:1px solid #e8eef1;background:#f8fbfc;font-size:13px;line-height:1.6;color:#315069;">
        <div><a href="${business.phoneHref}" style="color:#0c9ea6;text-decoration:none;">${escapeHtml(business.phone)}</a></div>
        <div>${escapeHtml(business.address)}</div>
        <div><a href="https://athomefamilyservices.com" style="color:#0c9ea6;text-decoration:none;">athomefamilyservices.com</a></div>
        <div><a href="${business.instagram}" style="color:#0c9ea6;text-decoration:none;">Instagram</a></div>
        <div style="margin-top:12px;"><a href="${input.unsubscribeUrl}" style="color:#0c9ea6;">Unsubscribe</a></div>
      </div>
    </div>
  </div>`;
}

export function renderMarketingEmail(input: {
  subject: string;
  previewText?: string;
  body: string;
  unsubscribeUrl: string;
}) {
  const bodyHtml = renderBodyHtml(input.body);
  return renderEmailShell({
    title: input.subject,
    previewText: input.previewText,
    contentHtml: bodyHtml,
    unsubscribeUrl: input.unsubscribeUrl
  });
}

export function renderLeadResponseEmail(input: {
  title: string;
  intro: string;
  body?: string;
  summary: Array<{ label: string; value: string }>;
  unsubscribeUrl: string;
  replyToEmail: string;
}) {
  const summaryRows = input.summary
    .filter((item) => item.value.trim())
    .map(
      (item) =>
        `<tr><td style="padding:7px 8px 7px 0;color:#5a7388;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(
          item.label
        )}</td><td style="padding:7px 0;color:#0f2d45;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(item.value)}</td></tr>`
    )
    .join('');

  const bodyHtml = input.body?.trim()
    ? `<p style="margin:0 0 14px 0;line-height:1.6;color:#315069;word-break:break-word;overflow-wrap:anywhere;white-space:pre-wrap;">${escapeHtml(
        input.body.trim()
      )}</p>`
    : '';

  return renderEmailShell({
    title: input.title,
    contentHtml: `<p style="margin:0 0 14px 0;line-height:1.6;color:#315069;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(
      input.intro
    )}</p>
    ${bodyHtml}
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px 0;">${summaryRows}</table>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <a href="tel:+18049193030" style="display:inline-block;background:#0f2d45;color:#fff;text-decoration:none;padding:10px 14px;border-radius:10px;font-weight:600;">Call (804) 919-3030</a>
      <a href="mailto:${escapeHtml(input.replyToEmail)}" style="display:inline-block;background:#0c9ea6;color:#fff;text-decoration:none;padding:10px 14px;border-radius:10px;font-weight:600;">Reply by Email</a>
    </div>`,
    unsubscribeUrl: input.unsubscribeUrl
  });
}
