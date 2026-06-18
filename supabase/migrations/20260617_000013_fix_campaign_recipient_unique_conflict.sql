-- Fix the ON CONFLICT target for email_campaign_recipients upserts.
--
-- lib/storage.ts -> recordEmailCampaignRecipient() upserts with
--   onConflict: 'campaign_id,email'  =>  ON CONFLICT (campaign_id, email)
-- but migration 20260302_000007 only created an EXPRESSION unique index on
--   (campaign_id, lower(email)).
-- Postgres does not match an expression index to an ON CONFLICT specification on
-- the bare columns, so every recipient write during sendBlastCampaign() failed
-- with 42P10 ("no unique or exclusion constraint matching the ON CONFLICT
-- specification"), breaking the email blast path.
--
-- All recipient emails are lowercased before insert (recordEmailCampaignRecipient),
-- so a plain-column unique on (campaign_id, email) provides identical guarantees and
-- is the index ON CONFLICT (campaign_id, email) actually resolves against.

drop index if exists athome_family_services_llc.email_campaign_recipients_campaign_email_key;

create unique index if not exists email_campaign_recipients_campaign_email_key
  on athome_family_services_llc.email_campaign_recipients (campaign_id, email);

select pg_notify('pgrst', 'reload schema');
