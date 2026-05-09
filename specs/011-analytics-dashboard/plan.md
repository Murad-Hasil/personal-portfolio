# Plan: Analytics Dashboard — /admin

**Feature ID**: 011  
**Spec**: `specs/011-analytics-dashboard/spec.md`  
**Estimated Time**: 4–6 hours  
**Date**: 2026-05-09  

---

## Architecture Overview

```
Browser /admin
    │
    ├── Not authed → Login form
    │       └── POST /api/admin/verify (Next.js route)
    │               └── compares password vs process.env.ADMIN_PASSWORD
    │                       └── returns { token } on success
    │
    └── Authed (token in sessionStorage)
            └── GET /api/admin/analytics (Next.js route)
                    └── GET /analytics/summary (FastAPI)
                            └── aggregates page_views table
```

**Security model:**
- `ADMIN_PASSWORD` lives only in Vercel env (server-side)
- `ADMIN_SECRET` lives only in HF Spaces env (backend)
- Frontend `/api/admin/verify` never returns the password — returns a short-lived token (HMAC of timestamp + secret)
- Backend `/analytics/summary` checks `Authorization: Bearer <ADMIN_SECRET>` header
- sessionStorage clears on tab/browser close

---

## Task Breakdown

### Task 1 — Backend: GET /analytics/summary (45 min)

**File**: `backend/app/routers/analytics.py`

Add new endpoint:
```python
GET /analytics/summary
Headers: Authorization: Bearer <ADMIN_SECRET>
```

SQL aggregations (all in one session):
- `total_views`: `SELECT COUNT(*) FROM page_views`
- `views_today`: `WHERE created_at >= today`
- `views_7d`: `WHERE created_at >= now - 7 days`
- `views_30d`: `WHERE created_at >= now - 30 days`
- `top_pages`: `GROUP BY page ORDER BY count DESC LIMIT 10`
- `top_referrers`: `GROUP BY referrer ORDER BY count DESC LIMIT 10`
- `views_by_day`: `GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`

Response model: `AnalyticsSummary` Pydantic model.

Auth: read `ADMIN_SECRET` from env. If header missing or wrong → 401.

New env var needed: `ADMIN_SECRET` (add to `.env.example` + HF Spaces).

---

### Task 2 — Frontend: API Routes (30 min)

**File 1**: `frontend/src/app/api/admin/verify/route.ts`
- `POST` — reads `password` from request body
- Compares to `process.env.ADMIN_PASSWORD` (server-side only)
- On match: returns `{ ok: true, token: <ADMIN_SECRET> }` (ADMIN_SECRET proxied securely)
- On mismatch: returns `{ ok: false }` with 401

**File 2**: `frontend/src/app/api/admin/analytics/route.ts`
- `GET` — reads `Authorization` header from request
- Validates token matches `process.env.ADMIN_SECRET`
- Proxies to `${BACKEND_URL}/analytics/summary` with `Authorization: Bearer <ADMIN_SECRET>`
- Returns summary JSON

New env vars needed:
- `ADMIN_PASSWORD` — Vercel env var (secret, never NEXT_PUBLIC_)
- `ADMIN_SECRET` — same value as backend's `ADMIN_SECRET`

---

### Task 3 — Frontend: Admin Page UI (2–3 hours)

**File**: `frontend/src/app/admin/page.tsx`

**State machine** (simple, no external state lib):
```
"checking" → fetch /api/admin/analytics with stored token
    → 200: show "dashboard"
    → 401/error: show "login"
"login"
    → user submits password → POST /api/admin/verify
    → success: save token to sessionStorage → show "dashboard"
    → fail: show error
"dashboard" → show all data sections
```

**Login form:**
- Single password input + submit button
- Error state: "Incorrect password"
- Matches portfolio design (dark bg, cyan button, JetBrains Mono)

**Dashboard sections:**

```
┌────────────────────────────────────────────────────────┐
│  // Analytics Dashboard        [Refresh] [Logout]       │
├──────────┬──────────┬──────────┬────────────────────────┤
│  Total   │  Today   │  7 Days  │  30 Days               │
│  1,284   │   12     │   84     │   342                  │
├────────────────────────────────────────────────────────┤
│  Daily Views — Last 30 Days                            │
│  [custom SVG bar chart]                                │
├─────────────────────────┬──────────────────────────────┤
│  Top Pages              │  Top Referrers               │
│  / ................. 520 │  linkedin.com ......... 95  │
│  /projects/crm ... 210  │  Direct .............. 78   │
└─────────────────────────┴──────────────────────────────┘
```

**Custom SVG bar chart** (no library):
- 30 bars, width proportional to container
- Bar height proportional to max daily count
- Cyan fill (`--accent-cyan` at 60% opacity)
- Today's bar highlighted (full opacity)
- X-axis: date labels every 7 days

---

### Task 4 — Design & Responsiveness (30 min)

Uses existing CSS custom properties only — no new colors.

Mobile (375px):
- Stat cards: 2×2 grid
- Chart: horizontal scroll container (overflow-x: auto)
- Tables: vertical stack (page on top, count below)

---

### Task 5 — Environment Variables (15 min)

Add to:
- `backend/.env.example`: `ADMIN_SECRET=your-admin-secret`
- `backend/.env` (local): set value
- Vercel dashboard: `ADMIN_PASSWORD`, `ADMIN_SECRET`
- HF Spaces dashboard: `ADMIN_SECRET`

---

## File Changes

| File | Action |
|------|--------|
| `backend/app/routers/analytics.py` | Add `GET /analytics/summary` endpoint |
| `backend/.env.example` | Add `ADMIN_SECRET` |
| `frontend/src/app/admin/page.tsx` | New — login + dashboard |
| `frontend/src/app/api/admin/verify/route.ts` | New — password check |
| `frontend/src/app/api/admin/analytics/route.ts` | New — analytics proxy |

Total: 2 modified + 3 new files.

---

## Constitution Compliance Check

| Principle | Check |
|-----------|-------|
| I. Spec-First | ✅ Spec written before code |
| II. Content Authenticity | ✅ Real data from DB, no placeholders |
| III. Design System | ✅ Uses `--accent-cyan`, `--bg-primary`, etc. only |
| IV. Type Safety | ✅ Pydantic model for response, TypeScript strict |
| V. Accessibility | ✅ Password form has label, keyboard nav |
| VI. RAG Chatbot | ✅ No impact |
| VII. Secrets | ✅ ADMIN_PASSWORD never in NEXT_PUBLIC_, never committed |

---

## Risks

1. **HF Spaces env var propagation** — after adding `ADMIN_SECRET`, HF Space needs restart. Deploy via subtree push triggers restart automatically.
2. **Empty database** — if `page_views` table has 0 rows, dashboard shows zeros (acceptable).
3. **SQL performance** — 5 queries on a small table (< 10K rows) will be fast; no indexes needed yet.
