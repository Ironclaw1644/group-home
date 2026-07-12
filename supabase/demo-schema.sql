-- ============================================================================
-- demo_athome — throwaway clone of athome_family_services_llc for DEMO_MODE.
--
-- Run this ONCE against the Supabase project, then point the app at it with
-- DEMO_MODE=1 and SUPABASE_SCHEMA=demo_athome. It mirrors the columns the app
-- reads/writes (derived from lib/supabase/cms.types.ts + supabase/migrations/*).
--
-- IMPORTANT — expose the schema to PostgREST or every request 404s:
--   Supabase Dashboard -> Project Settings -> API -> "Exposed schemas"
--   add:  demo_athome
--   (or add it to db config `pgrst.db_schemas` / API settings), then reload:
--   select pg_notify('pgrst', 'reload schema');
--
-- Data is wiped + reseeded nightly by /api/demo/reset (vercel.json cron). RLS is
-- intentionally wide-open here because this schema holds only disposable demo data.
-- ============================================================================

create schema if not exists demo_athome;
create extension if not exists pgcrypto;

grant usage on schema demo_athome to anon, authenticated, service_role;

-- shared updated_at trigger -------------------------------------------------
create or replace function demo_athome.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- announcements -------------------------------------------------------------
create table if not exists demo_athome.announcements (
  id text primary key,
  title text not null,
  body text not null,
  active boolean not null default true,
  start_date date,
  end_date date,
  target_pages text[] not null default '{}',
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- pages ---------------------------------------------------------------------
create table if not exists demo_athome.pages (
  key text primary key,
  label text not null,
  value text not null,
  updated_at timestamptz not null default now()
);

-- gallery -------------------------------------------------------------------
create table if not exists demo_athome.gallery (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url text not null,
  alt text not null,
  section text not null default 'general',
  credit text
);

-- subscribers ---------------------------------------------------------------
create table if not exists demo_athome.subscribers (
  id text primary key,
  email text not null unique,
  name text,
  phone text,
  source text not null default 'form',
  opted_in boolean not null default false,
  status text not null default 'active' check (status in ('active', 'unsubscribed', 'bounced', 'complaint')),
  unsubscribed_at timestamptz,
  bounced_at timestamptz,
  complaint_at timestamptz,
  unsubscribe_reason text,
  archived_at timestamptz,
  archived_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists demo_subscribers_email_lower_key
  on demo_athome.subscribers (lower(email));

-- lead_notes ----------------------------------------------------------------
create table if not exists demo_athome.lead_notes (
  id text primary key,
  lead_id text not null,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists demo_lead_notes_lead_id_idx
  on demo_athome.lead_notes (lead_id, created_at desc);

-- leads ---------------------------------------------------------------------
create table if not exists demo_athome.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  contact_name text,
  contact_email text,
  contact_phone text,
  company_name text,
  message text,
  page_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  lead_type text,
  status text default 'new',
  forwarded_to_leadops boolean not null default false,
  leadops_forwarded_at timestamptz,
  leadops_error text,
  confirmation_sent_at timestamptz,
  followup_sent_at timestamptz,
  last_email_error text,
  admin_notified_at timestamptz,
  admin_notify_error text,
  archived_at timestamptz,
  archived_by text
);
create index if not exists demo_leads_created_at_idx on demo_athome.leads (created_at desc);
create index if not exists demo_leads_status_idx on demo_athome.leads (status);
create index if not exists demo_leads_lead_type_idx on demo_athome.leads (lead_type);
create index if not exists demo_leads_archived_at_idx on demo_athome.leads (archived_at);

-- activity_events -----------------------------------------------------------
create table if not exists demo_athome.activity_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  event_type text not null check (event_type in ('page_view', 'cta_click', 'form_submit')),
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  device text,
  city text,
  region text,
  country text,
  ip_hash text,
  user_agent text,
  cta_name text,
  form_name text
);
create index if not exists demo_activity_events_created_at_idx on demo_athome.activity_events (created_at desc);
create index if not exists demo_activity_events_event_type_idx on demo_athome.activity_events (event_type);

-- email_events --------------------------------------------------------------
create table if not exists demo_athome.email_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  type text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists demo_email_events_email_created_at_idx
  on demo_athome.email_events (lower(email), created_at desc);

-- email_campaigns -----------------------------------------------------------
create table if not exists demo_athome.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preview_text text,
  body text not null,
  audience_source text,
  idempotency_key text not null unique,
  status text not null default 'draft' check (status in ('draft', 'sending', 'sent', 'failed')),
  sent_at timestamptz,
  total_recipients integer not null default 0,
  sent_count integer not null default 0,
  skipped_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- email_campaign_recipients -------------------------------------------------
create table if not exists demo_athome.email_campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references demo_athome.email_campaigns(id) on delete cascade,
  email text not null,
  status text not null check (status in ('sent', 'skipped')),
  reason text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists demo_email_campaign_recipients_campaign_idx
  on demo_athome.email_campaign_recipients (campaign_id, created_at desc);
create unique index if not exists demo_email_campaign_recipients_campaign_email_key
  on demo_athome.email_campaign_recipients (campaign_id, lower(email));

-- updated_at triggers -------------------------------------------------------
drop trigger if exists set_announcements_updated_at on demo_athome.announcements;
create trigger set_announcements_updated_at before update on demo_athome.announcements
  for each row execute function demo_athome.set_updated_at();

drop trigger if exists set_pages_updated_at on demo_athome.pages;
create trigger set_pages_updated_at before update on demo_athome.pages
  for each row execute function demo_athome.set_updated_at();

drop trigger if exists set_subscribers_updated_at on demo_athome.subscribers;
create trigger set_subscribers_updated_at before update on demo_athome.subscribers
  for each row execute function demo_athome.set_updated_at();

drop trigger if exists set_lead_notes_updated_at on demo_athome.lead_notes;
create trigger set_lead_notes_updated_at before update on demo_athome.lead_notes
  for each row execute function demo_athome.set_updated_at();

drop trigger if exists set_email_campaigns_updated_at on demo_athome.email_campaigns;
create trigger set_email_campaigns_updated_at before update on demo_athome.email_campaigns
  for each row execute function demo_athome.set_updated_at();

-- grants + default privileges ----------------------------------------------
grant all privileges on all tables in schema demo_athome to anon, authenticated, service_role;
grant all privileges on all sequences in schema demo_athome to anon, authenticated, service_role;
grant all privileges on all routines in schema demo_athome to anon, authenticated, service_role;

alter default privileges in schema demo_athome grant all privileges on tables to anon, authenticated, service_role;
alter default privileges in schema demo_athome grant all privileges on sequences to anon, authenticated, service_role;
alter default privileges in schema demo_athome grant all privileges on routines to anon, authenticated, service_role;

-- permissive RLS (disposable demo data only) --------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'announcements', 'pages', 'gallery', 'subscribers', 'lead_notes',
    'leads', 'activity_events', 'email_events', 'email_campaigns', 'email_campaign_recipients'
  ]
  loop
    execute format('alter table demo_athome.%I enable row level security', t);
    execute format('drop policy if exists demo_all on demo_athome.%I', t);
    execute format(
      'create policy demo_all on demo_athome.%I for all to public using (true) with check (true)', t
    );
  end loop;
end;
$$;

select pg_notify('pgrst', 'reload schema');
