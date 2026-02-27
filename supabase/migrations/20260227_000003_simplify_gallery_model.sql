create schema if not exists athome_family_services_llc;
create extension if not exists pgcrypto;

create table if not exists athome_family_services_llc.gallery (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url text not null,
  alt text not null,
  section text not null default 'general',
  credit text
);

alter table athome_family_services_llc.gallery
  add column if not exists created_at timestamptz default now(),
  add column if not exists url text,
  add column if not exists alt text,
  add column if not exists section text default 'general',
  add column if not exists credit text;

update athome_family_services_llc.gallery
set
  created_at = coalesce(created_at, now()),
  url = coalesce(url, ''),
  alt = coalesce(nullif(alt, ''), 'Gallery image'),
  section = coalesce(
    nullif(section, ''),
    case
      when to_regclass('athome_family_services_llc.gallery') is not null and exists (
        select 1
        from information_schema.columns c
        where c.table_schema = 'athome_family_services_llc'
          and c.table_name = 'gallery'
          and c.column_name = 'category'
      ) then null
      else 'general'
    end,
    'general'
  );

-- Carry over legacy category values into section when both exist.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'athome_family_services_llc'
      and table_name = 'gallery'
      and column_name = 'category'
  ) then
    execute $sql$
      update athome_family_services_llc.gallery
      set section = case
        when nullif(section, '') is null and category in ('our-home', 'announcements', 'general') then category
        when nullif(section, '') is null then 'general'
        else section
      end
    $sql$;
  end if;
end;
$$;

alter table athome_family_services_llc.gallery
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column url set not null,
  alter column alt set not null,
  alter column section set default 'general',
  alter column section set not null;

-- Convert legacy text id to uuid when needed.
do $$
declare
  id_type text;
begin
  select data_type into id_type
  from information_schema.columns
  where table_schema = 'athome_family_services_llc'
    and table_name = 'gallery'
    and column_name = 'id';

  if id_type = 'text' then
    alter table athome_family_services_llc.gallery add column if not exists id_uuid uuid default gen_random_uuid();

    execute $sql$
      update athome_family_services_llc.gallery
      set id_uuid = case
        when id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then id::uuid
        else coalesce(id_uuid, gen_random_uuid())
      end
      where id_uuid is null
    $sql$;

    alter table athome_family_services_llc.gallery drop constraint if exists gallery_pkey;
    alter table athome_family_services_llc.gallery drop column id;
    alter table athome_family_services_llc.gallery rename column id_uuid to id;
  end if;

  if id_type is null then
    alter table athome_family_services_llc.gallery add column id uuid default gen_random_uuid();
  end if;
end;
$$;

alter table athome_family_services_llc.gallery
  alter column id set default gen_random_uuid(),
  alter column id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'gallery_pkey'
      and conrelid = 'athome_family_services_llc.gallery'::regclass
  ) then
    alter table athome_family_services_llc.gallery add constraint gallery_pkey primary key (id);
  end if;
end;
$$;

alter table athome_family_services_llc.gallery drop column if exists is_hero;
alter table athome_family_services_llc.gallery drop column if exists sort_order;
alter table athome_family_services_llc.gallery drop column if exists category;
alter table athome_family_services_llc.gallery drop column if exists hero;
alter table athome_family_services_llc.gallery drop column if exists sort_index;
alter table athome_family_services_llc.gallery drop column if exists order_index;
alter table athome_family_services_llc.gallery drop column if exists position;
alter table athome_family_services_llc.gallery drop column if exists updated_at;

create index if not exists gallery_section_created_at_idx
  on athome_family_services_llc.gallery (section, created_at desc);
