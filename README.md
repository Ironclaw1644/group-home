# At Home Family Services, LLC Website + Admin (Next.js App Router)

This repository contains a mobile-first marketing site and a protected admin dashboard for **At Home Family Services, LLC**.

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- Supabase Postgres (CMS tables isolated in schema `athome_family_services_llc`)
- LeadOps ingest forwarding for centralized copy storage
- Admin allowlist auth (cookie-based) with Supabase helper scaffolding included in `lib/supabase/`

## Implemented Public Routes

- `/`
- `/services`
- `/our-home`
- `/requirements`
- `/placement-inquiry`
- `/placement-inquiry/success`
- `/tour`
- `/announcements`
- `/resources`
- `/faq`
- `/contact`
- `/locations/[slug]` (curated static slugs)
- `/services/[slug]` (curated static slugs)

## Admin

- `/admin` (protected)
- `/admin/login`

Sections:

- Leads (reads from local Supabase table `athome_family_services_llc.leads` via `/api/leads`)
- Announcements/Banners CRUD (Supabase CMS schema)
- Pages Editor (editable text blocks)
- Gallery Manager (URL-based image entries; can be upgraded to file uploads/storage provider)
- Subscribers/Email list (Supabase CMS schema + CSV export)
- Activity (lead trend summaries from parsed meta JSON)

## LeadOps Routing

### Submit route

`POST /api/submit`

- Receives JSON body
- Forwards to `LEADOPS_API_ROUTE`
- Adds `source_key: process.env.LEADOPS_SOURCE`
- Uses bearer auth via `LEADOPS_TOKEN`

### Admin leads read route

`GET /api/leads`

- Reads from local Supabase schema table `athome_family_services_llc.leads`
- Protected by admin auth

## Environment Variables

Copy `.env.example` and set:

- `LEADOPS_API_ROUTE`
- `LEADOPS_TOKEN`
- `LEADOPS_SOURCE=athome-family-services-llc`
- `ADMIN_ALLOWLIST` (comma-separated emails)
- `NEXT_PUBLIC_SITE_URL`
- `CMS_SUPABASE_URL`
- `CMS_SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `CMS_SCHEMA=athome_family_services_llc`
- Supabase keys if you choose to upgrade admin auth (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)

## Supabase CMS Schema (WalkPerro Project)

- CMS data is stored in a dedicated schema: `athome_family_services_llc`
- Tables:
  - `announcements`
  - `pages`
  - `gallery`
  - `subscribers`
  - `lead_notes`
- Migration is idempotent and only creates objects in the CMS schema:
  - `supabase/migrations/20260226_000001_create_athome_family_services_llc_cms.sql`

Apply the migration in your WalkPerro Supabase project before using admin CMS features.

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Vercel Deployment Notes

- Set all env vars in Vercel Project Settings.
- `NEXT_PUBLIC_SITE_URL` should match the deployed domain (temporary: `https://group-home.vercel.app`).
- Configure `CMS_SUPABASE_URL`, `CMS_SUPABASE_SERVICE_ROLE_KEY`, and `CMS_SCHEMA=athome_family_services_llc`.
- Gallery manager currently stores image URLs (not uploaded binaries). Use persistent object storage for production uploads if you add file upload support.

## SEO

- Per-page metadata (title/description/OG/Twitter)
- Canonical URLs
- JSON-LD LocalBusiness schema
- `robots.txt` and `sitemap.xml`
- Internal links across navigation/footer/landing pages/resources

## Notes / Follow-up Enhancements

- Upgrade admin auth from allowlist cookie login to full Supabase Auth UI/session enforcement.
- Replace URL-based gallery entries with actual uploads + persistent storage.
