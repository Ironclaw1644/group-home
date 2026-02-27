create schema if not exists athome_family_services_llc;

grant usage on schema athome_family_services_llc to service_role;

create or replace function athome_family_services_llc.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists athome_family_services_llc.announcements (
  id text primary key,
  title text not null,
  body text not null,
  active boolean not null default true,
  start_date date null,
  end_date date null,
  target_pages text[] not null default '{}',
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists athome_family_services_llc.pages (
  key text primary key,
  label text not null,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists athome_family_services_llc.gallery (
  id text primary key,
  url text not null,
  alt text not null,
  category text not null default 'general',
  is_hero boolean not null default false,
  sort_order integer not null default 0,
  credit text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists athome_family_services_llc.subscribers (
  id text primary key,
  email text not null unique,
  name text null,
  source text not null,
  opted_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists athome_family_services_llc.lead_notes (
  id text primary key,
  lead_id text not null,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant all privileges on all tables in schema athome_family_services_llc to service_role;
grant all privileges on all sequences in schema athome_family_services_llc to service_role;
grant all privileges on all routines in schema athome_family_services_llc to service_role;

alter default privileges in schema athome_family_services_llc
grant all privileges on tables to service_role;

alter default privileges in schema athome_family_services_llc
grant all privileges on sequences to service_role;

alter default privileges in schema athome_family_services_llc
grant all privileges on routines to service_role;

create index if not exists announcements_active_priority_idx
  on athome_family_services_llc.announcements (active, priority, created_at desc);

create index if not exists gallery_sort_order_idx
  on athome_family_services_llc.gallery (sort_order, created_at desc);

create index if not exists subscribers_created_at_idx
  on athome_family_services_llc.subscribers (created_at desc);

create index if not exists lead_notes_lead_id_idx
  on athome_family_services_llc.lead_notes (lead_id, created_at desc);

drop trigger if exists set_announcements_updated_at on athome_family_services_llc.announcements;
create trigger set_announcements_updated_at
before update on athome_family_services_llc.announcements
for each row execute function athome_family_services_llc.set_updated_at();

drop trigger if exists set_pages_updated_at on athome_family_services_llc.pages;
create trigger set_pages_updated_at
before update on athome_family_services_llc.pages
for each row execute function athome_family_services_llc.set_updated_at();

drop trigger if exists set_gallery_updated_at on athome_family_services_llc.gallery;
create trigger set_gallery_updated_at
before update on athome_family_services_llc.gallery
for each row execute function athome_family_services_llc.set_updated_at();

drop trigger if exists set_subscribers_updated_at on athome_family_services_llc.subscribers;
create trigger set_subscribers_updated_at
before update on athome_family_services_llc.subscribers
for each row execute function athome_family_services_llc.set_updated_at();

drop trigger if exists set_lead_notes_updated_at on athome_family_services_llc.lead_notes;
create trigger set_lead_notes_updated_at
before update on athome_family_services_llc.lead_notes
for each row execute function athome_family_services_llc.set_updated_at();
