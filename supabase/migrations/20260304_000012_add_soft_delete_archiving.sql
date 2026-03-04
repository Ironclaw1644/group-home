alter table if exists athome_family_services_llc.leads
  add column if not exists archived_at timestamptz null,
  add column if not exists archived_by text null;

alter table if exists athome_family_services_llc.subscribers
  add column if not exists archived_at timestamptz null,
  add column if not exists archived_by text null;

create index if not exists leads_archived_at_idx
  on athome_family_services_llc.leads (archived_at);

create index if not exists subscribers_archived_at_idx
  on athome_family_services_llc.subscribers (archived_at);
