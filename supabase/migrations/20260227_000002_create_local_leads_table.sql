create table if not exists athome_family_services_llc.leads (
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
  leadops_error text
);

create index if not exists leads_created_at_idx
  on athome_family_services_llc.leads (created_at desc);

create index if not exists leads_status_idx
  on athome_family_services_llc.leads (status);

create index if not exists leads_lead_type_idx
  on athome_family_services_llc.leads (lead_type);

create index if not exists leads_contact_email_idx
  on athome_family_services_llc.leads (contact_email);
