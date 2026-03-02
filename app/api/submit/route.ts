import { NextResponse } from 'next/server';
import { forwardLead } from '@/lib/leadops';
import { assertTopLevelLead, parseLeadMeta } from '@/lib/forms';
import { insertLocalLead, markLeadForwardError, markLeadForwarded, upsertSubscriber } from '@/lib/storage';
import { sendLeadTransactionalEmails } from '@/lib/email/service';

function parseReferer(input?: string | null) {
  if (!input) return { referrer: undefined as string | undefined, pagePath: undefined as string | undefined, search: new URLSearchParams() };
  try {
    const url = new URL(input);
    return { referrer: url.toString(), pagePath: url.pathname, search: url.searchParams };
  } catch {
    return { referrer: input, pagePath: undefined as string | undefined, search: new URLSearchParams() };
  }
}

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as Record<string, unknown>;
    const payload = assertTopLevelLead(json);
    const meta = parseLeadMeta(payload.message) || {};
    const referer = parseReferer(req.headers.get('referer'));
    const clientPagePath = typeof json.page_path === 'string' ? json.page_path : undefined;
    const clientReferrer = typeof json.referrer === 'string' ? json.referrer : undefined;
    const clientUtmSource = typeof json.utm_source === 'string' ? json.utm_source : undefined;
    const clientUtmMedium = typeof json.utm_medium === 'string' ? json.utm_medium : undefined;
    const clientUtmCampaign = typeof json.utm_campaign === 'string' ? json.utm_campaign : undefined;
    const clientUtmTerm = typeof json.utm_term === 'string' ? json.utm_term : undefined;
    const clientUtmContent = typeof json.utm_content === 'string' ? json.utm_content : undefined;

    const localLead = await insertLocalLead({
      contact_name: payload.contact_name,
      contact_email: payload.contact_email,
      contact_phone: payload.contact_phone,
      company_name: payload.company_name,
      message: payload.message,
      page_path: clientPagePath || (typeof meta.page_path === 'string' ? meta.page_path : referer.pagePath),
      utm_source: clientUtmSource || (typeof meta.utm_source === 'string' ? meta.utm_source : referer.search.get('utm_source') || undefined),
      utm_medium: clientUtmMedium || (typeof meta.utm_medium === 'string' ? meta.utm_medium : referer.search.get('utm_medium') || undefined),
      utm_campaign: clientUtmCampaign || (typeof meta.utm_campaign === 'string' ? meta.utm_campaign : referer.search.get('utm_campaign') || undefined),
      utm_term: clientUtmTerm || (typeof meta.utm_term === 'string' ? meta.utm_term : referer.search.get('utm_term') || undefined),
      utm_content: clientUtmContent || (typeof meta.utm_content === 'string' ? meta.utm_content : referer.search.get('utm_content') || undefined),
      referrer: clientReferrer || referer.referrer,
      lead_type: typeof meta.lead_type === 'string' ? meta.lead_type : 'general',
      status: 'new'
    });

    const subscribeUpdates = meta.subscribe_updates === true || meta.subscribe_updates === 'true' || meta.subscribe_updates === 'on';
    if (subscribeUpdates && payload.contact_email) {
      try {
        await upsertSubscriber({
          email: payload.contact_email,
          name: payload.contact_name,
          source: String(meta.lead_type || 'form'),
          opted_in: true
        });
      } catch (subscriberError) {
        const subscriberMessage = subscriberError instanceof Error ? subscriberError.message : 'Subscriber opt-in failed';
        console.error('Subscriber opt-in failed', { leadId: localLead.id, error: subscriberMessage });
      }
    }

    let forwarded = false;
    let forwardError: string | null = null;
    try {
      await forwardLead(payload);
      await markLeadForwarded(localLead.id);
      forwarded = true;
    } catch (error) {
      forwardError = error instanceof Error ? error.message : 'LeadOps forwarding failed';
      console.error('LeadOps forwarding failed', { leadId: localLead.id, error: forwardError });
      await markLeadForwardError(localLead.id, forwardError);
    }

    try {
      await sendLeadTransactionalEmails(localLead);
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : 'Transactional email failed';
      console.error('Transactional email failed', { leadId: localLead.id, error: message });
    }

    return NextResponse.json({ ok: true, leadId: localLead.id, forwarded, forwardError });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
