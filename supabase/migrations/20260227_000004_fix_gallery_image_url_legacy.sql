create schema if not exists athome_family_services_llc;

alter table if exists athome_family_services_llc.gallery
  add column if not exists url text,
  add column if not exists alt text,
  add column if not exists section text default 'general',
  add column if not exists credit text,
  add column if not exists created_at timestamptz default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'athome_family_services_llc'
      and table_name = 'gallery'
      and column_name = 'image_url'
  ) then
    execute 'update athome_family_services_llc.gallery set url = coalesce(url, image_url)';
    execute 'alter table athome_family_services_llc.gallery alter column image_url drop not null';
    execute 'alter table athome_family_services_llc.gallery drop column image_url';
  end if;
end;
$$;

update athome_family_services_llc.gallery
set
  created_at = coalesce(created_at, now()),
  url = coalesce(url, ''),
  alt = coalesce(nullif(alt, ''), 'Gallery image'),
  section = coalesce(nullif(section, ''), 'general');

alter table athome_family_services_llc.gallery
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column url set not null,
  alter column alt set not null,
  alter column section set default 'general',
  alter column section set not null;

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

select pg_notify('pgrst', 'reload schema');
