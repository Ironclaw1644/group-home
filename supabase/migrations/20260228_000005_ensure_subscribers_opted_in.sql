create schema if not exists athome_family_services_llc;

create table if not exists athome_family_services_llc.subscribers (
  id text primary key,
  email text not null unique,
  name text,
  source text not null default 'form',
  opted_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table athome_family_services_llc.subscribers
  add column if not exists source text,
  add column if not exists opted_in boolean,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

update athome_family_services_llc.subscribers
set
  source = coalesce(nullif(source, ''), 'form'),
  opted_in = coalesce(opted_in, false),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table athome_family_services_llc.subscribers
  alter column source set default 'form',
  alter column source set not null,
  alter column opted_in set default false,
  alter column opted_in set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

create unique index if not exists subscribers_email_key
  on athome_family_services_llc.subscribers (email);

select pg_notify('pgrst', 'reload schema');
