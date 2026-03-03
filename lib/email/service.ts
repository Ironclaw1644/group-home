import 'server-only';

import { SITE_URL } from '@/lib/utils';
import type { LocalLead } from '@/lib/types';
import {
  createEmailCampaign,
  finalizeEmailCampaign,
  getLocalLeadById,
  getEmailCampaignByIdempotencyKey,
  getSubscriberByEmail,
  listSubscribersForBlast,
  logEmailEvent,
  markLeadEmailError,
  markLeadEmailSent,
  recordEmailCampaignRecipient,
} from '@/lib/storage';
import { createEmailToken } from '@/lib/email/tokens';
import { sendResendEmail } from '@/lib/email/resend';
import { renderLeadResponseEmail, renderMarketingEmail } from '@/lib/email/template';
import { parseLeadMeta } from '@/lib/forms';

function adminRecipient() {
  const value = process.env.RESEND_TO?.trim();
  if (!value) throw new Error('RESEND_TO is required');
  return value;
}

function replyToRecipient() {
  return process.env.RESEND_REPLY_TO?.trim() || 'Athomefamilyservice@yahoo.com';
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

function parseLeadMessageForEmail(message?: string | null) {
  const text = String(message || '');
  const summaryPart = text.split('---meta---')[0]?.trim() || '';
  const lines = summaryPart
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const summaryMap = new Map<string, string>();
  let additionalNotes = '';

  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx <= 0) continue;
    const label = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!value) continue;
    const lower = label.toLowerCase();
    if (lower === 'notes' || lower === 'message') {
      if (!additionalNotes) additionalNotes = value;
      continue;
    }
    summaryMap.set(label, value);
  }

  if (!additionalNotes) {
    const notesMatch = summaryPart.match(/(?:^|\n)Notes:\s*([\s\S]*)$/i);
    if (notesMatch?.[1]) additionalNotes = notesMatch[1].trim().slice(0, 600);
  }

  return { summaryMap, additionalNotes };
}

function leadSummaryRows(lead: LocalLead) {
  const { summaryMap, additionalNotes } = parseLeadMessageForEmail(lead.message);
  const meta = parseLeadMeta(lead.message);
  const city = typeof meta?.city === 'string' ? meta.city : '';
  const region = typeof meta?.region === 'string' ? meta.region : '';
  const location = [city, region].filter(Boolean).join(', ');

  const rows = [
    { label: 'Name', value: lead.contact_name || '' },
    { label: 'Email', value: lead.contact_email || '' },
    { label: 'Phone', value: lead.contact_phone || '' },
    { label: 'Request Type', value: leadTypeLabel(lead.lead_type) },
    { label: 'Location', value: location || '' },
    { label: 'Timeframe', value: summaryMap.get('Timeframe') || summaryMap.get('Move-in timeframe') || '' },
    { label: 'Preferred Contact', value: summaryMap.get('Preferred contact') || '' },
    { label: 'Submitted', value: lead.created_at || '' },
    { label: 'Additional notes', value: additionalNotes }
  ];

  return rows.filter((row) => row.value.trim());
}

export async function buildLeadDetailEmailDraft(input: {
  leadId: string;
  type: 'confirmation' | 'followup';
  subjectOverride?: string;
  bodyOverride?: string;
  sendAgain?: boolean;
}) {
  const lead = await getLocalLeadById(input.leadId);
  if (!lead) throw new Error('Lead not found');
  if (!lead.contact_email) throw new Error('Lead does not have an email address');

  if (!input.sendAgain) {
    if (input.type === 'confirmation' && lead.confirmation_sent_at) {
      throw new Error('Confirmation was already sent for this lead');
    }
    if (input.type === 'followup' && lead.followup_sent_at) {
      throw new Error('Follow-up was already sent for this lead');
    }
  }

  const subscriber = await getSubscriberByEmail(lead.contact_email);
  if (subscriber && subscriber.status !== 'active') {
    throw new Error('Email blocked — this contact is unsubscribed or suppressed');
  }

  const defaultSubject =
    input.type === 'confirmation'
      ? `${leadTypeLabel(lead.lead_type)} Received`
      : `Following up on your ${leadTypeLabel(lead.lead_type)}`;
  const defaultIntro =
    input.type === 'confirmation'
      ? 'Thank you for reaching out. We received your request and will follow up shortly.'
      : 'We wanted to follow up and help you with next steps. Reply to this email or call us anytime.';

  const subject = input.subjectOverride?.trim() || defaultSubject;
  const body = input.bodyOverride?.trim() || '';
  const html = renderLeadResponseEmail({
    title: subject,
    intro: defaultIntro,
    body,
    summary: leadSummaryRows(lead),
    unsubscribeUrl: unsubscribeUrl(lead.contact_email),
    replyToEmail: replyToRecipient()
  });

  return { lead, subject, html };
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

export async function sendLeadTransactionalEmails(lead: LocalLead) {
  const adminTo = adminRecipient();
  const typeLabel = leadTypeLabel(lead.lead_type);
  const summary = leadSummaryRows(lead);

  await sendResendEmail({
    to: adminTo,
    subject: `New ${typeLabel} submission`,
    html: renderLeadResponseEmail({
      title: `New ${typeLabel} submission`,
      intro: 'A new request was submitted on the website.',
      summary,
      unsubscribeUrl: unsubscribeUrl(adminTo),
      replyToEmail: replyToRecipient()
    }),
    replyTo: replyToRecipient()
  });
  await logEmailEvent({ email: adminTo, type: 'sent', meta: { kind: 'lead_admin_notification', lead_id: lead.id } });

  if (!lead.contact_email) return;

  const subscriber = await getSubscriberByEmail(lead.contact_email);
  const html = renderLeadResponseEmail({
    title: 'We received your request',
    intro: 'Thank you for contacting At Home Family Services, LLC. We received your request and will follow up soon.',
    body: 'If you need immediate help, call us at (804) 919-3030.',
    summary,
    unsubscribeUrl: unsubscribeUrl(lead.contact_email),
    replyToEmail: replyToRecipient()
  });
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

export async function sendLeadDetailEmail(input: {
  leadId: string;
  type: 'confirmation' | 'followup';
  subjectOverride?: string;
  bodyOverride?: string;
  sendAgain?: boolean;
}) {
  const draft = await buildLeadDetailEmailDraft(input);
  const lead = draft.lead;

  try {
    const resend = await sendResendEmail({
      to: lead.contact_email,
      subject: draft.subject,
      html: draft.html,
      replyTo: replyToRecipient()
    });
    await markLeadEmailSent(lead.id, input.type);
    await logEmailEvent({
      email: lead.contact_email,
      type: input.type === 'confirmation' ? 'lead_confirmation_sent' : 'lead_followup_sent',
      meta: { lead_id: lead.id }
    });
    return { ok: true, resendId: resend.id || null, to: lead.contact_email, type: input.type };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email send failed';
    await markLeadEmailError(lead.id, message);
    throw error;
  }
}
