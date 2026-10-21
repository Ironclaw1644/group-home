-- Weekly Google rank tracking (app/api/cron/serp-sync, lib/seo/serp-sync.ts).
--
-- serp_snapshots: one row per tracked query per run day. `position` is our best
-- organic position in the top 20 of a Chesterfield, VA-localised Google SERP,
-- or null when the site is not in the top 20. `page` is which of our URLs
-- Google chose for that query.
--
-- serp_runs: one row per cron run, success or failure, so a run that died
-- (Apify cap reached, timeout, bad token) leaves a reason behind instead of a
-- silent gap in the history.
--
-- Additive only. Server-side access goes through the service role, like every
-- other table in this schema; RLS stays on with no policies, so anon and
-- authenticated get nothing. Explicit grants because new tables no longer
-- inherit API grants by default (Supabase change, 2026-10-30).

create table if not exists athome_family_services_llc.serp_snapshots (
  id bigint generated always as identity primary key,
  query text not null,
  position integer null,
  page text null,
  captured_on date not null default ((now() at time zone 'America/New_York')::date),
  source text not null default 'apify',
  created_at timestamptz not null default now(),
  constraint serp_snapshots_source_chk check (source in ('apify', 'gsc'))
);

create unique index if not exists serp_snapshots_query_day_source_key
  on athome_family_services_llc.serp_snapshots (query, captured_on, source);

create index if not exists serp_snapshots_lookup_idx
  on athome_family_services_llc.serp_snapshots (query, captured_on desc);

create table if not exists athome_family_services_llc.serp_runs (
  id bigint generated always as identity primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz null,
  status text not null default 'running',
  apify_run_id text null,
  queries integer not null default 0,
  ranking integer null,
  error text null,
  constraint serp_runs_status_chk check (status in ('running', 'ok', 'error'))
);

alter table athome_family_services_llc.serp_snapshots enable row level security;
alter table athome_family_services_llc.serp_runs enable row level security;

grant select, insert, update on athome_family_services_llc.serp_snapshots to service_role;
grant select, insert, update on athome_family_services_llc.serp_runs to service_role;
grant usage, select on sequence athome_family_services_llc.serp_snapshots_id_seq to service_role;
grant usage, select on sequence athome_family_services_llc.serp_runs_id_seq to service_role;
