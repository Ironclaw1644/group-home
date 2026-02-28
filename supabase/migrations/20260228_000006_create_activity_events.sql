create schema if not exists athome_family_services_llc;
create extension if not exists pgcrypto;

create table if not exists athome_family_services_llc.activity_events (
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
  cta_name text,
  form_name text
);

create index if not exists activity_events_created_at_idx
  on athome_family_services_llc.activity_events (created_at desc);

create index if not exists activity_events_event_type_idx
  on athome_family_services_llc.activity_events (event_type);

create index if not exists activity_events_page_path_idx
  on athome_family_services_llc.activity_events (page_path);

create index if not exists activity_events_utm_campaign_idx
  on athome_family_services_llc.activity_events (utm_campaign);

select pg_notify('pgrst', 'reload schema');
