# Admin + Email Plan (Phase 0 Scan)

## 1) Activity data + why location is "Unknown"

### Current pipeline
- Client tracking starts in `components/activity-tracker.tsx` and `lib/track-client.ts`.
- Events are sent to `POST /api/track` (`app/api/track/route.ts`).
- Rows are stored in `athome_family_services_llc.activity_events` (migration `20260228_000006_create_activity_events.sql`).
- Analytics are computed in `lib/activity-analytics.ts` and rendered in the Activity tab in `components/admin-dashboard.tsx`.

### Why city/location is mostly Unknown
- `activity_events` has only one geo field: `city`.
- Client payload never sends `city` (no geo capture in `track-client.ts` / `activity-tracker.tsx`).
- `/api/track` only accepts `body.city` and does not derive geo from request context (`request.geo`/Vercel headers not used).
- Analytics normalizes missing city to `"Unknown"` in `lib/activity-analytics.ts`.

## 2) Leads list + mobile filter/layout fit issues

### Current render path
- All admin UI is in `components/admin-dashboard.tsx`.
- Leads tab has always-visible filters at top (search/status/type/pagination summary), then mobile cards (`md:hidden`) and desktop table (`md:block`).
- Data fetch: `GET /api/leads` (`app/api/leads/route.ts`) with `q`, `status`, `lead_type`, `page`, `pageSize`.

### Likely mobile pain points
- Filters are always expanded; no accordion/drawer behavior on small screens.
- No dedicated “Apply/Reset filters” UX for small screens; controls stack but still feel dense.
- Some text blocks (emails/metadata rows) can create visual crowding on narrow devices.
- The leads + details split is good on XL, but on mobile the detail card follows long content and is not optimized for quick triage.

## 3) Current subscriber/email data model (Supabase)

### Tables/migrations found
- `athome_family_services_llc.subscribers`
  - Created in `20260226_000001_create_athome_family_services_llc_cms.sql`
  - Hardened in `20260228_000005_ensure_subscribers_opted_in.sql`
- `athome_family_services_llc.leads` (separate, local lead records)
- `athome_family_services_llc.activity_events`

### Subscriber fields today
- `id`, `email` (unique), `name`, `source`, `opted_in`, `created_at`, `updated_at`
- No bounce/complaint/unsubscribe timestamps or statuses yet.
- No `email_events` or `campaigns` table yet.

## 4) Existing submit endpoints (placement/tour/contact)

- Public forms (`app/placement-inquiry/page.tsx`, `app/tour/page.tsx`, `app/contact/page.tsx`) all submit through shared `LeadForm` (`components/lead-form.tsx`).
- All post to a single endpoint: `POST /api/submit` (`app/api/submit/route.ts`).
- Lead type is encoded via form metadata (`lead_type`: `placement`, `tour`, `general`) inside the stored message/meta.

## 5) Existing Resend usage + where server email should live

- No existing Resend integration found.
- No `resend` package in `package.json` and no server mail utility currently present.
- Best placement for server-side sending:
  - `lib/email/*` utility module(s) for composing/sending.
  - Route handlers under `app/api/admin/...` for blast operations and `app/api/resend/webhook/route.ts` for events.
  - Trigger transactional sends from `app/api/submit/route.ts` after lead insert (non-blocking / failure-tolerant).

## 6) Single subscribers table vs multiple

- Email addresses are currently stored in a single `subscribers` table.
- Leads also contain `contact_email`, but subscriber consent state is only represented in `subscribers`.
- Conclusion: one canonical subscription table exists today, but it needs status/compliance expansion.

## 7) Recommended unsubscribe policy for transactional confirmations

Recommended approach:
- Treat unsubscribe as **marketing-only** by default.
- Keep confirmations/operational responses allowed (transactional), because they are expected replies to direct form submissions.
- Implement explicit fields to support this safely:
  - `status` for marketing eligibility (`active|unsubscribed|bounced|complaint`)
  - optional `unsubscribed_all boolean` only if a global stop is required later.

This gives compliance-safe blast suppression while preserving essential user-requested confirmations.
