alter table if exists athome_family_services_llc.leads
  add column if not exists admin_notified_at timestamptz null,
  add column if not exists admin_notify_error text null;
