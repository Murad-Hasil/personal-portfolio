# Spec: Analytics Dashboard — /admin

**Feature ID**: 011  
**Status**: Approved  
**Version**: 1.0  
**Date**: 2026-05-09  

---

## Problem Statement

Page views are being tracked in Neon PostgreSQL (`page_views` table) but there is no way to view this data. To understand which projects get the most attention and where traffic comes from, a private admin dashboard is needed.

## Goals

- View total page views, daily breakdowns, top pages, and top referrers
- Password-protected — only Murad can access it
- No third-party analytics service (Vercel Analytics, Google Analytics) — use existing data
- Simple, fast, matches portfolio design system

## Out of Scope

- Multi-user admin access
- Real-time live view (polling is fine)
- Editing portfolio content from dashboard
- Chat session analytics (future)

---

## Functional Requirements

### FR-016 — Admin Login Gate

- Route: `/admin`
- Shows a password form before dashboard content
- Password validated server-side via `POST /api/admin/verify`
- On success: token stored in `sessionStorage` (not localStorage)
- On page refresh: token re-checked against server; redirect to login if invalid
- Password set via `ADMIN_PASSWORD` Vercel env var (non-public, never `NEXT_PUBLIC_`)

### FR-017 — Analytics Summary API

New backend endpoint:
```
GET /analytics/summary
Authorization: Bearer <ADMIN_SECRET>
```

Returns:
```json
{
  "total_views": 1284,
  "views_today": 12,
  "views_7d": 84,
  "views_30d": 342,
  "top_pages": [
    { "page": "/", "count": 520 },
    { "page": "/projects/crm-digital-fte", "count": 210 }
  ],
  "top_referrers": [
    { "referrer": "linkedin.com", "count": 95 }
  ],
  "views_by_day": [
    { "date": "2026-05-01", "count": 18 }
  ]
}
```

Protected with `ADMIN_SECRET` env var on backend (same value as `ADMIN_PASSWORD` on frontend, or separate).

### FR-018 — Dashboard Page

Route: `/admin` (after login)

Sections:
1. **Stat cards row** — Total Views, Today, Last 7 Days, Last 30 Days
2. **Daily trend bar chart** — last 30 days (custom SVG bars, no chart library)
3. **Top Pages table** — page path + view count, sorted descending
4. **Top Referrers table** — referrer domain + count (null referrer shown as "Direct")
5. **Refresh button** — re-fetches data
6. **Logout button** — clears sessionStorage token

---

## Non-Functional Requirements

- **Security**: password never sent to browser; `/api/admin/verify` compares server-side only
- **Performance**: dashboard loads in under 2s (single SQL query with aggregates)
- **Design**: uses portfolio design tokens (`--bg-primary`, `--accent-cyan`, etc.) — NOT a separate design language
- **No new dependencies**: custom SVG chart, no recharts/chart.js install

---

## Data Model

No schema changes. Uses existing `page_views` table:
```sql
id          SERIAL PRIMARY KEY
page        VARCHAR(100)
referrer    VARCHAR(500)
country     VARCHAR(2)
created_at  TIMESTAMP
```

---

## Acceptance Criteria

- [ ] `/admin` without auth redirects to login form
- [ ] Wrong password shows error, does not grant access
- [ ] Correct password shows dashboard with real data
- [ ] Page refresh with valid session skips login
- [ ] All 4 stat cards show correct numbers
- [ ] Daily bar chart renders last 30 days
- [ ] Top pages table sorted correctly
- [ ] Logout clears session and returns to login
- [ ] No ADMIN_PASSWORD or ADMIN_SECRET value ever exposed to browser console or DOM
- [ ] Mobile-responsive at 375px
