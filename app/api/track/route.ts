import { NextResponse } from 'next/server';
import { cmsServerClient } from '@/lib/supabase/cmsServer';
import type { Database } from '@/lib/supabase/cms.types';
import type { ActivityEventType } from '@/lib/types';

const ALLOWED_EVENT_TYPES: ActivityEventType[] = ['page_view', 'cta_click', 'form_submit'];

function cleanText(value: unknown, max = 255) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function cleanPath(value: unknown) {
  const text = cleanText(value, 500);
  if (!text) return null;
  if (!text.startsWith('/')) return null;
  return text;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const eventType = cleanText(body.event_type, 40) as ActivityEventType | null;
    if (!eventType || !ALLOWED_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 });
    }

    const row: Database['athome_family_services_llc']['Tables']['activity_events']['Insert'] = {
      session_id: cleanText(body.session_id, 120),
      event_type: eventType,
      page_path: cleanPath(body.page_path),
      referrer: cleanText(body.referrer, 1000),
      utm_source: cleanText(body.utm_source, 120),
      utm_medium: cleanText(body.utm_medium, 120),
      utm_campaign: cleanText(body.utm_campaign, 160),
      utm_term: cleanText(body.utm_term, 160),
      utm_content: cleanText(body.utm_content, 160),
      device: cleanText(body.device, 20),
      city: cleanText(body.city, 120),
      cta_name: cleanText(body.cta_name, 100),
      form_name: cleanText(body.form_name, 100)
    };

    const supabase = cmsServerClient();
    const { error } = await supabase.from('activity_events').insert(row);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Tracking failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
