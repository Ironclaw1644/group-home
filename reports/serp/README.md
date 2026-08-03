# SERP tracking

## Usage

```bash
npm run serp -- ingest ~/Downloads/athomefamilyservices.com-Performance-on-Search-YYYY-MM-DD.zip --report
```

Export from Search Console → Performance → Export → Download CSV. Ingest is
idempotent per export end-date, so re-running the same file updates rather than
duplicates. `npm run serp` on its own reprints the report from stored snapshots.

Files:

- `targets.json` — keywords we intend to rank for, plus an `excluded` list of
  queries we deliberately do **not** chase, with reasons.
- `snapshots.json` — append-only history. Search Console keeps 16 months and
  will not diff two arbitrary exports; this will.
- `latest-report.md` — generated. Do not hand-edit.

Ingest roughly monthly. Position deltas only mean something across comparable
window lengths, so keep using the same date range (last 3 months).

## Baseline: 2026-05-02 → 2026-08-01

6 clicks, 150 impressions, 4.0% CTR, ~1.6 impressions/day. Impressions on 46 of
92 days. This is a low-authority site with very little search presence yet —
every number below is small enough that it indicates direction, not certainty.

### Finding 1 — vocabulary mismatch (the main one)

Search Console named 12 queries; 86% of impressions came from queries too rare
to disclose. Of the named commercial queries, almost all use words the site
never used:

| Query | Position |
| --- | ---: |
| dd waiver providers chesterfield county | 18.0 |
| disability services in chesterfield | 32.5 |
| group day support chesterfield | 40.3 |
| disability services midlothian va | 44.0 |
| disability services chesterfield va | 45.5 |
| residential living solutions for adults with disabilities in chester | 49.3 |

People search **"disability services"**. The site said "supportive living",
"group home", "ID/DD" — accurate industry language, but not the words families
type. Ranking at 32–50 for these means Google matched the site on topic despite
the wording, not because of it.

Fixed by putting the searched phrasing into titles, descriptions, and visible
copy where it is truthful.

### Finding 2 — ranking without earning clicks

79 impressions sat in the top 10 with zero clicks, including `/services` at
position 2.3 and `/requirements` at 4.3. Every title followed
`Page Name | At Home Family Services, LLC`, which spends the first and most
valuable characters on the brand and leaves nothing to distinguish the result.

Rewritten so titles lead with the service and the location, and each page has
its own description instead of inheriting the site default.

Caveat: 79 impressions is a small sample. Zero clicks there is suggestive, not
proof, but titles are the cheapest thing to fix and the likeliest cause.

### Finding 3 — queries we should not chase

Three named queries point at services this business does not provide:
"group day support" (we are residential, not a day program), "senior home
placement services" (we serve adults 18+ with developmental disabilities, not
seniors), and three out-of-state geographies. Recorded in `targets.json`
under `excluded` so nobody optimizes toward them later.

### Finding 4 — device split

Mobile ranks far better than desktop (average position 11.9 vs 24.9) but drew
only 25 of 150 impressions. Worth rechecking after a few months of data before
drawing conclusions.

### What to watch next

1. Do the "disability services + city" queries move off page 4–5?
2. Do the top-10 pages start converting impressions into clicks?
3. `dd waiver providers chesterfield county` at position 18 is the closest
   high-intent query to page one. We deliberately do **not** claim to be an
   enrolled waiver provider — `/requirements` only states that Medicaid waiver
   and private pay are discussed during screening. Keep it that way.
