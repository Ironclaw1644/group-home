-- Ensure lead_notes has timestamp columns expected by API and schema cache.
alter table if exists athome_family_services_llc.lead_notes
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

update athome_family_services_llc.lead_notes
set
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table athome_family_services_llc.lead_notes
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

create or replace function athome_family_services_llc.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lead_notes_updated_at on athome_family_services_llc.lead_notes;
create trigger set_lead_notes_updated_at
before update on athome_family_services_llc.lead_notes
for each row execute function athome_family_services_llc.set_updated_at();
