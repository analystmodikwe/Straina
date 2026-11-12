# IMPLEMENTATION PLAN — STRAINA

**Document Status:** v1.0 — ready for team review  
**Date:** 12 Nov 2026  
**Author:** Lesedi Modikwe (Tech Lead) — [`analystmodikwe`](https://github.com/analystmodikwe)  
**References:**  
- PRD: [`docs/PRD.md`](docs/PRD.md) — v1.0 final draft candidate  
- Stitch designs: [`docs/designs/`](docs/designs/)  
- Project board: <https://github.com/users/analystmodikwe/projects/8>

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Conventions](#3-repository-conventions)
4. [Architecture](#4-architecture)
5. [Database Schema and Migrations](#5-database-schema-and-migrations)
6. [Environment Variables](#6-environment-variables)
7. [Phases and Issues](#7-phases-and-issues)
8. [Test Strategy](#8-test-strategy)
9. [Deployment](#9-deployment)
10. [Open Items](#10-open-items)

---

## 1. Overview

Straina is an AMR surveillance mapping platform (see PRD §1). This plan describes the work in **five sequential phases** that build on each other, so the app is always in a working, deployable state at the end of every phase.

| Phase | Focus | Checkpoint |
| --- | --- | --- |
| Phase 0 | Foundation — deps, router, layout shell, Supabase client, `.env.example` | Wed 12 Nov |
| Phase 1 | Database, Auth and RLS | Checkpoint 1 / mid-way |
| Phase 2 | Public map view (S1, S2, S3, S4) | Checkpoint 3 — Mon 16 Nov |
| Phase 3 | Record submission and management (S6, S7) | Before final submission |
| Phase 4 | Admin screens and polish (S8, S9, S10, error states, accessibility) | Final — Fri 20 Nov |

> [!IMPORTANT]
> Every piece of work follows the GitHub Flow in the brief: **Issue → branch from `main` → build TDD → PR with screenshots → review → squash-merge → delete branch**. No direct pushes to `main`, not even from the Tech Lead.

---

## 2. Tech Stack

| Layer | Technology | Why |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite | Already in repo |
| Styling | Tailwind CSS v3 | Agreed — Galaletsang |
| Map | Leaflet 1.x + `react-leaflet` + OpenStreetMap tiles | No API key needed; agreed — OQ3 |
| Routing | React Router v7 (`react-router-dom`) | Provides the routes in PRD §10 |
| Backend / DB / Auth | Supabase (Postgres, Supabase Auth, RLS) | Agreed — OQ4 |
| DB client | `@supabase/supabase-js` v2 | Agreed |
| Validation | `zod` | Already present in `node_modules` |
| Testing | Vitest + React Testing Library + `@testing-library/user-event` | Agreed — Gareth |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | Already running |
| Hosting | Vercel (frontend) + hosted Supabase | Agreed — Thami |

> [!NOTE]
> `zod` and `zod-validation-error` are already in `node_modules` (confirmed by file tree). They were not added to `package.json` yet — Phase 0 makes them explicit dependencies.

---

## 3. Repository Conventions

These match the team rules in `CONTRIBUTING.md` and the README "How we work" section.

### Branch naming

```
feature/<issue-number>-short-name
fix/<issue-number>-short-name
chore/<issue-number>-short-name
docs/<issue-number>-short-name
```

### Commit messages (Conventional Commits)

```
feat: add AMR map layer (#22)
fix: redirect analyst away from /records (#31)
chore: install react-router-dom (#20)
docs: add implementation plan (#20)
test: T-US6-1 sign-in happy path (#28)
```

### Pull requests

Every PR must:
- Reference the Issue it closes (`Closes #N`)
- Describe **what changed and why**
- Include a **screenshot or test output** where relevant
- Pass CI (lint + typecheck + tests + build)
- Have at least **one approval** from a teammate
- Be reviewed by your AI agent first (note the AI review in the PR description)

### Labels used on Issues

`database` · `auth` · `frontend` · `map` · `testing` · `ci-deploy` · `docs` · `bug`

---

## 4. Architecture

```
Browser
  └── React SPA (Vite, TypeScript)
        ├── React Router v7  — client-side routes (§10 of PRD)
        ├── Leaflet / react-leaflet  — interactive map
        ├── @supabase/supabase-js  — Auth + DB queries
        └── Tailwind CSS  — styling
              │
              ▼ HTTPS
       Supabase Project (hosted)
        ├── Supabase Auth  — email+password, session tokens
        ├── Postgres (tables: data_sources, amr_observations, profiles)
        └── Row-Level Security  — enforces BR6–BR11
```

**Hotspot calculation (BR12):** computed **in the browser** after the filtered observation rows are fetched. The three parameters (`HOTSPOT_THRESHOLD_PCT`, `HOTSPOT_MIN_OBSERVATIONS`, `HOTSPOT_WINDOW_MONTHS`) are hard-coded constants in a `lib/hotspot.ts` file until OQ2 is resolved by Lerato and Thami.

**Public vs signed-in access (OQ10):** the plan follows the PRD's proposed answer — S1–S4 are public; S5 is the sign-in page; S6–S9 require sign-in; S10 is the access-denied page.

---

## 5. Database Schema and Migrations

The Supabase local dev environment was set up in PR #19 (`chore/19-supabase-local-dev`). The migration file at `supabase/migrations/20261111173438_init_schema.sql` currently exists but is empty.

### 5.1 Migration files (all go through PRs)

| File | Phase | Owner | What it contains |
| --- | --- | --- | --- |
| `supabase/migrations/20261111173438_init_schema.sql` | Phase 1 | Lesedi | Full schema (see §5.2) + RLS policies |
| `supabase/migrations/<timestamp>_seed_demo.sql` | Phase 1 | Lesedi | Demo data source row + synthetic AMR observations |

> [!CAUTION]
> **Never edit tables by hand in the Supabase dashboard.** Every database change is a migration file committed and merged through a PR. This is a course requirement.

### 5.2 Schema

#### `data_sources`

```sql
create table data_sources (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  url                     text,
  description             text,
  geographic_coverage     text not null,
  temporal_coverage_start date not null,
  temporal_coverage_end   date not null,
  last_updated            date not null,
  is_demo                 boolean not null default false,
  created_at              timestamptz not null default now()
);
```

#### `profiles`

```sql
-- Mirrors auth.users. Created by a trigger on sign-up.
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null check (role in ('admin','data_submitter','analyst')),
  created_at timestamptz not null default now()
);
```

#### `amr_observations`

```sql
create table amr_observations (
  id                 uuid primary key default gen_random_uuid(),
  data_source_id     uuid not null references data_sources(id),
  area_code          text not null,
  area_name          text not null,
  area_level         text not null,
  latitude           numeric(9,6) not null,
  longitude          numeric(9,6) not null,
  period_start       date not null,
  period_end         date not null check (period_end >= period_start),
  pathogen           text not null,
  antimicrobial      text not null,
  isolates_tested    integer not null check (isolates_tested >= 0),
  isolates_resistant integer not null check (isolates_resistant >= 0
                                             and isolates_resistant <= isolates_tested),
  created_by         uuid references profiles(id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
```

### 5.3 Row-Level Security policies (Phase 1)

Enable RLS on all three tables. Policies implement BR6–BR11.

| Table | Operation | Who can do it |
| --- | --- | --- |
| `data_sources` | SELECT | Anyone (anon + authenticated) |
| `data_sources` | INSERT, UPDATE | `admin` only |
| `amr_observations` | SELECT | Anyone (anon + authenticated) |
| `amr_observations` | INSERT | `admin` or `data_submitter` |
| `amr_observations` | UPDATE | `admin` (any row) or `data_submitter` (own rows: `created_by = auth.uid()`) |
| `amr_observations` | DELETE | `admin` (any row) or `data_submitter` (own rows) |
| `profiles` | SELECT | `admin` (all rows) or the row owner (`id = auth.uid()`) |
| `profiles` | UPDATE | `admin` only (role changes) |

> [!IMPORTANT]
> These policies must be tested with **direct database requests** (no browser) to satisfy T-PERM-2b through T-PERM-5b and T-US8-5, T-US9-4, T-US11-3, T-US12-3. Gareth owns this test suite.

---

## 6. Environment Variables

Add `.env.example` in Phase 0 (Lesedi). Real values shared privately and **never committed**.

```
# .env.example

# Supabase project URL — safe to put in the browser
VITE_SUPABASE_URL=https://<project-ref>.supabase.co

# Supabase anonymous (public) key — safe to put in the browser; access is
# controlled by Row-Level Security
VITE_SUPABASE_ANON_KEY=<anon-key>

# Service-role key — SECRET. Never use the VITE_ prefix.
# Not needed by the browser app. Used only in migration scripts.
# SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

---

## 7. Phases and Issues

> Every row below becomes **one GitHub Issue** on the project board.  
> Assignees are guides — anyone can open a PR for any issue, but the named person leads it.  
> `Labels` follow §3.

---

### Phase 0 — Foundation (target: Wed 12 Nov)

**Goal:** any team member can run the app locally and see a shell layout. CI stays green.

| # | Issue title | Assignee | Labels | Closes |
| --- | --- | --- | --- | --- |
| 20 | Install deps: react-router-dom, leaflet, react-leaflet, @supabase/supabase-js, tailwindcss, zod, @testing-library/react, @testing-library/user-event | Lesedi | `chore`, `frontend` | — |
| 21 | Configure Tailwind CSS and global styles | Galaletsang | `frontend` | — |
| 22 | Add `.env.example` and Supabase client singleton (`src/lib/supabase.ts`) | Lesedi | `chore`, `database` | — |
| 23 | Add React Router and app shell: `AppLayout` with header, `<Outlet>`, route stubs for all PRD §10 routes | Lesedi | `frontend` | — |
| 24 | Add `AuthContext` and `useAuth` hook (reads Supabase session; no sign-in UI yet) | Lesedi | `auth`, `frontend` | — |
| 25 | Add `ProtectedRoute` and `AdminRoute` guard components (redirect to `/sign-in` or `/access-denied`) | Lesedi | `auth`, `frontend` | — |

**Definition of done for Phase 0:** `npm run dev` shows a navigable shell; all four CI checks pass on the PR.

---

### Phase 1 — Database, Auth and RLS (target: Thu 13 Nov)

**Goal:** Supabase Auth works in the browser; the schema and RLS are applied locally and on the hosted project; direct-request permission tests pass.

| # | Issue title | Assignee | Labels | PRD refs |
| --- | --- | --- | --- | --- |
| 26 | Write full schema migration (`init_schema.sql`) with tables, constraints and RLS policies | Lesedi | `database` | §11, §8.2 |
| 27 | Write seed migration with demo `data_sources` row and ≥ 10 synthetic `amr_observations` rows (SA provinces, two pathogens, two antimicrobials, two time periods) | Lesedi | `database` | BR1, BR13, §11.5 |
| 28 | Build S5 Sign-in screen (`/sign-in`): email + password form, Supabase `signInWithPassword`, error states ERR7 / ERR13 / ERR1 | Lerato | `frontend`, `auth` | US6, S5 |
| 29 | Add Sign-out button to header; clear session, redirect to S1 (US7) | Lerato | `frontend`, `auth` | US7 |
| 30 | Write RLS integration tests: T-PERM-2b, T-PERM-3b, T-PERM-4b, T-PERM-5b (direct DB requests, each role) | Gareth | `testing` | §8.2, BR7–BR11 |
| 31 | Add `profiles` trigger: on `auth.users` insert, insert a row in `profiles` with `role = 'analyst'` by default | Lesedi | `database` | §11.3, OQ11 |

**Definition of done for Phase 1:** a test Admin, Data Submitter and Analyst account exist; sign-in and sign-out work; protected routes redirect correctly; RLS tests pass.

---

### Phase 2 — Public Map View (target: Mon 16 Nov — Checkpoint 3)

**Goal:** S1, S2, S3, S4 are live. Any visitor can explore the map and time view. Checkpoint 3 demo is possible.

| # | Issue title | Assignee | Labels | PRD refs |
| --- | --- | --- | --- | --- |
| 32 | S1 Home / Map (`/`): Leaflet map with AMR choropleth layer, legend, demo-data notice BR13, header sign-in/out | Galaletsang | `frontend`, `map` | US1, S1, F1 |
| 33 | S2 Map Exploration (`/explore`): time-period selector (year/quarter), pathogen + antimicrobial filters, map updates on change | Galaletsang | `frontend`, `map` | US2, US3, S2, F2 |
| 34 | S3 Location Detail (`/areas/:areaCode`): area name, period, resistance %, hotspot status (BR12), data source, demo notice | Lerato | `frontend` | US3, US4, US5, S3, F3 |
| 35 | Hotspot logic (`src/lib/hotspot.ts`): pure function implementing BR12 (parametrised constants); unit-tested | Thami | `frontend`, `testing` | US4, F4, BR12 |
| 36 | S4 Data Sources / About (`/about`): static explanation + data-source list from DB, demo labels, limitations disclaimer | Lerato | `frontend` | US5, US13, S4, F5, F6 |
| 37 | Write unit tests for hotspot logic (T-US4-1 through T-US4-4) | Gareth | `testing` | US4 |
| 38 | Write Vitest component tests for S1 loading / empty / error / demo-notice states (T-US1-1 through T-US1-5, QR2–QR5) | Gareth | `testing` | US1, QR2–QR5 |
| 39 | Write component tests for S2 time-filter and S3 detail panel (T-US2-*, T-US3-*) | Gareth | `testing` | US2, US3 |
| 40 | Write tests for demo-data labelling (T-US13-1 through T-US13-3) | Gareth | `testing` | US13, BR13 |

**Definition of done for Phase 2:** the live Vercel link shows the map with data; the hotspot layer works; a visitor can explore without signing in; CI is green; Checkpoint 3 demo passes.

---

### Phase 3 — Record Submission and Management (target: Wed 18 Nov)

**Goal:** Admins and Data Submitters can add, edit and delete records. Analysts and visitors cannot.

| # | Issue title | Assignee | Labels | PRD refs |
| --- | --- | --- | --- | --- |
| 41 | S7 Records list (`/records`): table of observations, Edit / Delete buttons visible per BR8 / BR9, "Add record" button | Gareth | `frontend` | US8, US9, US10, S7 |
| 42 | S6 Submit record (`/records/new`): form with all §11.1 fields + data-source selector; Zod validation; success → S7 | Gareth | `frontend` | US8, S6, F9 |
| 43 | S6 Edit record (`/records/:recordId/edit`): pre-filled form; save update; Data Submitter restricted to own records | Gareth | `frontend` | US9, S6 |
| 44 | Delete record: confirmation dialog; delete call; Data Submitter restricted to own records; success toast | Gareth | `frontend` | US10, S7 |
| 45 | Write tests for S6/S7: T-US8-1 through T-US8-5, T-US9-1 through T-US9-4, T-US10-1 through T-US10-4 | Gareth | `testing` | US8–US10 |
| 46 | Offline and error state tests for S6/S7: ERR1, ERR12, ERR13, ERR14 | Gareth | `testing` | EC1, EC9, QR4, QR5 |

**Definition of done for Phase 3:** a Data Submitter can add a record and it appears on the map; an Analyst cannot; RLS tests still pass; CI green.

---

### Phase 4 — Admin Screens, Error States and Polish (target: Fri 20 Nov — Final)

**Goal:** Admin can manage users and data sources. All error states are consistent. Accessibility and responsive layout checked.

| # | Issue title | Assignee | Labels | PRD refs |
| --- | --- | --- | --- | --- |
| 47 | S8 Manage users (`/admin/users`): list users (email, role), role selector per user, Save; Admin only | Thami | `frontend` | US11, S8, F10 |
| 48 | S9 Manage data sources (`/admin/sources`): list + add/edit form; `is_demo` checkbox; Admin only | Thami | `frontend` | US12, S9, F11 |
| 49 | S10 Access-denied page (`/access-denied`): ERR9 message + "Back to map" button | Galaletsang | `frontend` | S10, Flow 6 |
| 50 | Session-expiry handling: on 401 / expired session, redirect to S5 + ERR8 toast (Flow 9) | Lesedi | `auth`, `frontend` | US6, EC5 |
| 51 | Offline banner (ERR1): global `navigator.onLine` listener, disable Save/Add/Edit/Delete while offline | Thami | `frontend` | EC1, QR5 |
| 52 | Write tests for S8: T-US11-1 through T-US11-3 | Gareth | `testing` | US11 |
| 53 | Write tests for S9: T-US12-1 through T-US12-3 | Gareth | `testing` | US12 |
| 54 | Write tests for edge cases: T-EC3-1, T-EC5-1, T-EC6-1, T-EC7-1, T-EC8-1, T-EC10-1 | Gareth | `testing` | EC3, EC5, EC6, EC7, EC8, EC10 |
| 55 | Responsive layout and accessibility pass: keyboard nav, contrast, ARIA labels, phone width (QR1, QR13) | Galaletsang | `frontend` | QR1, QR13 |
| 56 | Update README: live link, Stitch link, Loom link, test-login accounts, screenshots / GIF, known issues | Lerato | `docs` | §7 of brief |
| 57 | Vercel deployment: connect repo, set env vars, verify live link in incognito window | Thami | `ci-deploy` | §6 of brief |
| 58 | Final QA pass: run full Vitest suite, manual smoke test on live link (Flows 1–9, all roles) | Gareth | `testing` | QR10 |

**Definition of done for Phase 4:** all Issues closed; CI green; live Vercel link works; all role test accounts log in and are restricted correctly; README complete; Loom recorded.

---

## 8. Test Strategy

> [!NOTE]
> Owned by Gareth (QA / Test Lead). Everyone writes tests for the Issues they build; Gareth reviews and owns the overall plan.

### Test types

| Type | Tool | What is tested |
| --- | --- | --- |
| Unit | Vitest | Pure functions — hotspot logic (`lib/hotspot.ts`), validation helpers |
| Component | Vitest + React Testing Library | Each screen's loading / empty / error / success states; form validation |
| Integration (RLS) | Vitest + supabase-js | Direct DB requests that must be rejected by RLS (T-PERM-*b) |
| Manual (smoke) | Checklist in PR | Flows 1–9 for each role in a real browser; Checkpoint 3 demo |

### Test file locations

```
src/
  lib/
    hotspot.test.ts       # Unit tests — BR12 logic
  components/
    MapView.test.tsx      # S1 / S2 component tests
    LocationDetail.test.tsx
    SignIn.test.tsx
    RecordForm.test.tsx
    RecordList.test.tsx
    AdminUsers.test.tsx
    AdminSources.test.tsx
  integration/
    rls.test.ts           # T-PERM-2b through T-PERM-5b (direct DB calls)
```

### How to run

```bash
npm run lint        # ESLint
npm run typecheck   # tsc
npm test            # Vitest (all tests)
npm run build       # Vite build
```

All four commands run automatically on every PR via GitHub Actions.

### Test coverage targets (per PRD)

Every acceptance criterion (T-USn-m) has one test. Every edge case (T-ECn-m) has one test. Every permission row (T-PERM-n) has two tests (allowed + denied). The full list is in `docs/PRD.md` §5, §8.2 and §31.

---

## 9. Deployment

| Part | Service | How |
| --- | --- | --- |
| Frontend | Vercel | Connect the GitHub repo; Vercel redeploys automatically on every merge to `main` |
| Database + Auth | Supabase hosted project | Owned by Lesedi (Tech Lead); migrations applied with `supabase db push` |
| Environment variables | Vercel dashboard | `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; never in the repo |

**Deploy checklist (Thami — Issue #57):**
- [ ] Connect Vercel to `analystmodikwe/Straina`
- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel dashboard
- [ ] Run `supabase db push` on the hosted project after each schema migration PR merges
- [ ] Load seed data: `supabase db push` picks up the seed migration
- [ ] Test the live link in an incognito window (all public flows, then sign-in flows)
- [ ] Add the live link and Stitch link to `README.md`

> [!WARNING]
> Deploy early — by **Checkpoint 3 (Mon 16 Nov)**. A broken live link at the final submission loses marks.

---

## 10. Open Items

These items must be resolved before the corresponding phase's Issues can be completed. Flag blockers in the daily team thread.

| Item | Needed by | Owner | PRD ref |
| --- | --- | --- | --- |
| Confirm hotspot parameter values: `HOTSPOT_THRESHOLD_PCT`, `HOTSPOT_MIN_OBSERVATIONS`, `HOTSPOT_WINDOW_MONTHS` | Phase 2 (Issue #35) | Lerato, Thami | OQ2 |
| Confirm whether the map is public or sign-in only | Phase 0 (affects route guards) | Lerato | OQ10 |
| Confirm geographic resolution (province / district) for demo data | Phase 1 seed (Issue #27) | Lerato | OQ6 |
| Confirm account creation flow: does Admin invite users, or is there a self-signup? | Phase 1 (Issue #31) | Lerato, Lesedi | OQ11 |
| Stitch design link added to README and to `docs/designs/` | Phase 0 / Checkpoint 1 | Galaletsang | OQ5 |
| Confirm F8–F11 stay as Must (or shrink scope) | Phase 1 | Lerato | §32.1 |
| Supabase hosted project URL and anon key shared with team (privately) | Phase 0 | Lesedi | §12.4 |

---

*This plan is committed as `IMPLEMENTATION_PLAN.md` and linked from `README.md`. It is updated whenever scope changes — every change goes through a PR.*

