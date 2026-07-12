import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { cmsServerClient, IS_DEMO } from '@/lib/supabase/cmsServer';

export const dynamic = 'force-dynamic';

// Nightly (and on-demand) reset for the demo_athome schema. Wipes the tables the app
// writes to and reseeds a small, believable dataset so the demo always looks alive but
// never accumulates junk. Guarded three ways:
//   1. 404 unless DEMO_MODE=1 (endpoint simply doesn't exist in production).
//   2. Bearer CRON_SECRET (Vercel cron sends `Authorization: Bearer <CRON_SECRET>`).
//   3. ?key=<CRON_SECRET> for manual browser/curl triggering.

function notFound() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

function authorized(req: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) return false;
  const url = new URL(req.url);
  const key = url.searchParams.get('key')?.trim();
  const auth = req.headers.get('authorization') || '';
  const header = req.headers.get('x-cron-secret') || '';
  return auth === `Bearer ${expected}` || header === expected || key === expected;
}

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

// Tables cleared on reset, in FK-safe order (recipients -> campaigns cascade anyway).
const WIPE_TABLES = [
  'email_campaign_recipients',
  'email_campaigns',
  'email_events',
  'activity_events',
  'lead_notes',
  'leads',
  'subscribers',
  'announcements'
] as const;

async function resetDemo() {
  const supabase = cmsServerClient();

  // Wipe. Every table has an `id` column, so this removes all rows.
  for (const table of WIPE_TABLES) {
    const { error } = await supabase.from(table as 'leads').delete().not('id', 'is', null);
    if (error) throw new Error(`wipe ${table}: ${error.message}`);
  }

  // Reseed announcements (2).
  const announcements = [
    {
      id: randomUUID(),
      title: 'Now Accepting Placement Inquiries',
      body: 'We currently have limited openings for supportive living placements. Submit an inquiry and our team will follow up to discuss fit and availability.',
      active: true,
      start_date: daysAgoIso(3).slice(0, 10),
      end_date: null,
      target_pages: ['/', '/placement-inquiry'],
      priority: 1,
      created_at: daysAgoIso(3),
      updated_at: daysAgoIso(3)
    },
    {
      id: randomUUID(),
      title: 'Tours Available by Appointment',
      body: 'Phone and in-person tours are scheduled by appointment. Request a tour and we will share available times that week.',
      active: true,
      start_date: daysAgoIso(1).slice(0, 10),
      end_date: null,
      target_pages: ['/', '/tour'],
      priority: 2,
      created_at: daysAgoIso(1),
      updated_at: daysAgoIso(1)
    }
  ];
  const annRes = await supabase.from('announcements').insert(announcements);
  if (annRes.error) throw new Error(`seed announcements: ${annRes.error.message}`);

  // Reseed subscribers (3).
  const subscribers = ['active', 'active', 'active'].map((status, i) => {
    const email = [
      'linda.harper@example.com',
      'coordinator@example-agency.org',
      'marcus.webb@example.com'
    ][i];
    return {
      id: randomUUID(),
      email,
      name: ['Linda Harper', 'Agency Coordinator', 'Marcus Webb'][i],
      phone: [null, '(804) 555-0142', null][i],
      source: ['placement_form', 'tour_form', 'newsletter'][i],
      opted_in: true,
      status,
      created_at: daysAgoIso(10 - i * 3),
      updated_at: daysAgoIso(10 - i * 3)
    };
  });
  const subRes = await supabase.from('subscribers').insert(subscribers);
  if (subRes.error) throw new Error(`seed subscribers: ${subRes.error.message}`);

  // Reseed leads (5) — a realistic spread of types and statuses.
  const leads = [
    {
      contact_name: 'Linda Harper',
      contact_email: 'linda.harper@example.com',
      contact_phone: '(804) 555-0118',
      company_name: null,
      lead_type: 'placement',
      status: 'new',
      page_path: '/placement-inquiry',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'placement-va',
      message:
        'Lead Type: Placement Inquiry\nName: Linda Harper\nTimeframe: 30 days\nLocation: Richmond, VA\nSupport Level: moderate\nCoverage Type: Medicaid waiver\nTour/Call Preference: tour',
      created_at: daysAgoIso(1)
    },
    {
      contact_name: 'Marcus Webb',
      contact_email: 'marcus.webb@example.com',
      contact_phone: '(804) 555-0133',
      company_name: null,
      lead_type: 'tour',
      status: 'contacted',
      page_path: '/tour',
      utm_source: 'facebook',
      utm_medium: 'social',
      utm_campaign: 'awareness',
      message:
        'Lead Type: Tour Request\nName: Marcus Webb\nPreferred contact: phone\nNotes: Interested in touring for my brother in the next few weeks.',
      created_at: daysAgoIso(2)
    },
    {
      contact_name: 'Danielle Ortiz',
      contact_email: 'dortiz@example-agency.org',
      contact_phone: '(804) 555-0176',
      company_name: 'Commonwealth Support Coordination',
      lead_type: 'placement',
      status: 'new',
      page_path: '/placement-inquiry',
      utm_source: 'referral',
      utm_medium: 'partner',
      utm_campaign: null,
      message:
        'Lead Type: Placement Inquiry\nName: Danielle Ortiz\nTimeframe: ASAP\nLocation: North Chesterfield, VA\nSupport Level: high\nCoverage Type: Medicaid waiver\nTour/Call Preference: call',
      created_at: daysAgoIso(4)
    },
    {
      contact_name: 'James Whitfield',
      contact_email: 'jwhitfield@example.com',
      contact_phone: '(804) 555-0190',
      company_name: null,
      lead_type: 'contact',
      status: 'closed',
      page_path: '/contact',
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      message:
        'Lead Type: Contact Form\nName: James Whitfield\nNotes: General question about visiting hours and family involvement.',
      created_at: daysAgoIso(7)
    },
    {
      contact_name: 'Priya Nair',
      contact_email: 'priya.nair@example.com',
      contact_phone: '(804) 555-0201',
      company_name: null,
      lead_type: 'placement',
      status: 'contacted',
      page_path: '/placement-inquiry',
      utm_source: 'google',
      utm_medium: 'organic',
      utm_campaign: null,
      message:
        'Lead Type: Placement Inquiry\nName: Priya Nair\nTimeframe: exploring\nLocation: Chesterfield, VA\nSupport Level: light\nCoverage Type: private pay\nTour/Call Preference: either',
      created_at: daysAgoIso(9)
    }
  ];
  const leadsRes = await supabase.from('leads').insert(leads);
  if (leadsRes.error) throw new Error(`seed leads: ${leadsRes.error.message}`);

  return {
    ok: true,
    reset: true,
    seeded: { announcements: announcements.length, subscribers: subscribers.length, leads: leads.length }
  };
}

async function handle(req: Request) {
  if (!IS_DEMO) return notFound();
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const result = await resetDemo();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Reset failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
