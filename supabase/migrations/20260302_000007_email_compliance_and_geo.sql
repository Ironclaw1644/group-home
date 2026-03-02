create schema if not exists athome_family_services_llc;

alter table athome_family_services_llc.subscribers
  add column if not exists status text,
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists bounced_at timestamptz,
  add column if not exists complaint_at timestamptz,
  add column if not exists unsubscribe_reason text;

update athome_family_services_llc.subscribers
set
  email = lower(trim(email)),
  status = coalesce(status, case when coalesce(opted_in, false) then 'active' else 'unsubscribed' end);

alter table athome_family_services_llc.subscribers
  alter column status set default 'active',
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'subscribers_status_check'
  ) then
    alter table athome_family_services_llc.subscribers
      add constraint subscribers_status_check
      check (status in ('active', 'unsubscribed', 'bounced', 'complaint'));
  end if;
end $$;

create unique index if not exists subscribers_email_lower_key
  on athome_family_services_llc.subscribers (lower(email));

create table if not exists athome_family_services_llc.email_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  type text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists email_events_email_created_at_idx
  on athome_family_services_llc.email_events (lower(email), created_at desc);

create table if not exists athome_family_services_llc.email_campaigns (
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

create table if not exists athome_family_services_llc.email_campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references athome_family_services_llc.email_campaigns(id) on delete cascade,
  email text not null,
  status text not null check (status in ('sent', 'skipped')),
  reason text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_campaign_recipients_campaign_idx
  on athome_family_services_llc.email_campaign_recipients (campaign_id, created_at desc);

create unique index if not exists email_campaign_recipients_campaign_email_key
  on athome_family_services_llc.email_campaign_recipients (campaign_id, lower(email));

alter table athome_family_services_llc.activity_events
  add column if not exists region text,
  add column if not exists country text,
  add column if not exists ip_hash text,
  add column if not exists user_agent text;

create index if not exists activity_events_city_region_idx
  on athome_family_services_llc.activity_events (city, region);

select pg_notify('pgrst', 'reload schema');
