create schema if not exists athome_family_services_llc;

alter table athome_family_services_llc.leads
  add column if not exists confirmation_sent_at timestamptz,
  add column if not exists followup_sent_at timestamptz,
  add column if not exists last_email_error text;

create index if not exists leads_confirmation_sent_at_idx
  on athome_family_services_llc.leads (confirmation_sent_at);

create index if not exists leads_followup_sent_at_idx
  on athome_family_services_llc.leads (followup_sent_at);

select pg_notify('pgrst', 'reload schema');
