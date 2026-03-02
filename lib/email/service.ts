import 'server-only';

import { SITE_URL } from '@/lib/utils';
import type { LocalLead } from '@/lib/types';
import {
  createEmailCampaign,
  finalizeEmailCampaign,
  getEmailCampaignByIdempotencyKey,
  getSubscriberByEmail,
  listSubscribersForBlast,
  logEmailEvent,
  recordEmailCampaignRecipient,
} from '@/lib/storage';
import { createEmailToken } from '@/lib/email/tokens';
import { sendResendEmail } from '@/lib/email/resend';
import { renderMarketingEmail } from '@/lib/email/template';

function adminRecipient() {
  const value = process.env.RESEND_TO?.trim();
  if (!value) throw new Error('RESEND_TO is required');
  return value;
}

function unsubscribeUrl(email: string) {
  const token = createEmailToken(email);
  return `${SITE_URL}/unsubscribe?token=${encodeURIComponent(token)}`;
}

function uniqEmails(input: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of input) {
    const email = raw.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    result.push(email);
  }
  return result;
}

export async function sendTestBlastEmail(input: { subject: string; previewText?: string; body: string }) {
  const to = adminRecipient();
  const html = renderMarketingEmail({
    subject: input.subject,
    previewText: input.previewText,
    body: input.body,
    unsubscribeUrl: unsubscribeUrl(to)
  });
  const res = await sendResendEmail({ to, subject: `[TEST] ${input.subject}`, html });
  await logEmailEvent({ email: to, type: 'sent', meta: { kind: 'campaign_test', resend_id: res.id || null } });
  return res;
}

export async function sendBlastCampaign(input: {
  subject: string;
  previewText?: string;
  body: string;
  audienceSource?: string;
  idempotencyKey: string;
}) {
  const existing = await getEmailCampaignByIdempotencyKey(input.idempotencyKey);
  if (existing && (existing.status === 'sending' || existing.status === 'sent')) {
    return { campaign: existing, alreadyProcessed: true };
  }

  const campaign = await createEmailCampaign(input);
  const subscribers = await listSubscribersForBlast(input.audienceSource);
  const recipients = uniqEmails(subscribers.map((item) => item.email));

  let sentCount = 0;
  let skippedCount = 0;

  for (const email of recipients) {
    const subscriber = subscribers.find((item) => item.email.toLowerCase() === email);
    if (!subscriber || subscriber.status !== 'active') {
      skippedCount += 1;
      await recordEmailCampaignRecipient({ campaignId: campaign.id, email, status: 'skipped', reason: subscriber?.status || 'missing' });
      continue;
    }

    try {
      const html = renderMarketingEmail({
        subject: input.subject,
        previewText: input.previewText,
        body: input.body,
        unsubscribeUrl: unsubscribeUrl(email)
      });
      const resend = await sendResendEmail({ to: email, subject: input.subject, html });
      sentCount += 1;
      await recordEmailCampaignRecipient({ campaignId: campaign.id, email, status: 'sent' });
      await logEmailEvent({ email, type: 'sent', meta: { campaign_id: campaign.id, resend_id: resend.id || null } });
    } catch (error) {
      skippedCount += 1;
      const reason = error instanceof Error ? error.message.slice(0, 200) : 'send_failed';
      await recordEmailCampaignRecipient({ campaignId: campaign.id, email, status: 'skipped', reason });
      await logEmailEvent({ email, type: 'send_failed', meta: { campaign_id: campaign.id, reason } });
    }
  }

  await finalizeEmailCampaign({
    campaignId: campaign.id,
    status: 'sent',
    totalRecipients: recipients.length,
    sentCount,
    skippedCount
  });

  return { campaign: { ...campaign, status: 'sent', total_recipients: recipients.length, sent_count: sentCount, skipped_count: skippedCount }, alreadyProcessed: false };
}

function leadTypeLabel(leadType?: string) {
  if (leadType === 'placement') return 'Placement Inquiry';
  if (leadType === 'tour') return 'Tour Request';
  return 'Contact Form';
}

function transactionalHtml(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;background:#f5f1ea;padding:20px;color:#0f2d45;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d9e3e8;border-radius:12px;padding:20px;">
      <h1 style="margin:0 0 12px;font-size:22px;">${title}</h1>
      <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${body}</p>
    </div>
  </div>`;
}

export async function sendLeadTransactionalEmails(lead: LocalLead) {
  const adminTo = adminRecipient();
  const typeLabel = leadTypeLabel(lead.lead_type);
  const summary = [
    `Type: ${typeLabel}`,
    `Name: ${lead.contact_name || 'N/A'}`,
    `Email: ${lead.contact_email || 'N/A'}`,
    `Phone: ${lead.contact_phone || 'N/A'}`,
    `Page: ${lead.page_path || 'N/A'}`,
    `Message:\n${lead.message || ''}`
  ].join('\n');

  await sendResendEmail({
    to: adminTo,
    subject: `New ${typeLabel} submission`,
    html: transactionalHtml(`New ${typeLabel} submission`, summary)
  });
  await logEmailEvent({ email: adminTo, type: 'sent', meta: { kind: 'lead_admin_notification', lead_id: lead.id } });

  if (!lead.contact_email) return;

  const subscriber = await getSubscriberByEmail(lead.contact_email);
  const userBody = [
    `Hi ${lead.contact_name || ''},`,
    '',
    'Thanks for contacting At Home Family Services, LLC.',
    'We received your request and will follow up soon.',
    '',
    'If you need immediate help, call us at (804) 919-3030.',
    '',
    `Marketing email preferences: ${unsubscribeUrl(lead.contact_email)}`
  ].join('\n');

  const html = transactionalHtml('We received your request', userBody);
  await sendResendEmail({ to: lead.contact_email, subject: 'We received your request', html });
  await logEmailEvent({
    email: lead.contact_email,
    type: 'sent',
    meta: {
      kind: 'lead_confirmation',
      lead_id: lead.id,
      subscriber_status: subscriber?.status || 'none'
    }
  });
}
