# Thami Sithole — DevOps / Release

**GitHub:** `ThamiRoneo`
**Role:** DevOps / Release — admin screens, hotspot logic, CI/CD pipeline, Vercel deployment

> You write frontend screens, backend API calls, and tests.
> See [README.md](./README.md) for the full ownership matrix and anti-conflict rules.

---

## Frontend Work

You own the two Admin-only management screens and the offline-state banner.

| File | What it does |
|---|---|
| `src/pages/S8_ManageUsers.tsx` | Manage Users screen at `/admin/users` (US11). Lists all `profiles` rows — name, email, current role. Admin can change role to `admin`, `data_submitter` or `analyst`. Calls `getUsers()` and `updateRole()`. Shows `Toast` on success; `ErrorPanel` on failure. Protected: Admin only (uses `ProtectedRoute` from Lesedi). |
| `src/pages/S9_ManageSources.tsx` | Manage Data Sources screen at `/admin/sources` (US12). Lists `data_sources` rows. Admin can add a new data source (name + description + URL required, per PRD §11.2). **No "deactivate" action** — the PRD only specifies "add and change data sources" (US12). Calls `getDataSources()` from `src/api/sources.ts` (Lerato's file — import it, don't edit it). Write operations use `addDataSource()` and `updateDataSource()` from your own `src/api/users.ts` or coordinate with Lerato to add write functions to `sources.ts`. |
| `src/components/OfflineBanner.tsx` | Full-width banner shown when `useOnline()` returns `false`. Exact text from `src/lib/messages.ts` (ERR1). Imported into `src/App.tsx` by Lesedi in a small PR. |

**Correct user story IDs for your screens:**
- S8 = **US11** (Manage Users and Roles) → tests are `T-US11-*`
- S9 = **US12** (Manage Data Sources) → tests are `T-US12-*`

(US14–US17 do not exist in the PRD. The PRD stops at US13.)

---

## Backend Work

You own the users API, the hotspot calculation logic, the online-state hook, and all infrastructure config.

### Application Code

| File | What it does |
|---|---|
| `src/api/users.ts` | Exported functions: `getUsers(): Promise<Profile[]>` (OP10 — reads `profiles` table, Admin only), `updateRole(userId, role): Promise<void>` (OP11 — updates `profiles.role`, Admin only). Uses `supabaseClient` from `src/lib/supabase.ts`. Role values: `'admin'`, `'data_submitter'`, `'analyst'` (from `src/types/index.ts`). |
| `src/lib/hotspot.ts` | Exports `computeHotspots(observations: AmrObservation[]): HotspotResult[]` (BR12). Logic: filter to last `HOTSPOT_WINDOW_MONTHS = 6` months; group by `area_code` + pathogen + antimicrobial; compute resistance rate as `(sum(isolates_resistant) / sum(isolates_tested)) * 100`; flag as hotspot if rate ≥ `HOTSPOT_THRESHOLD_PCT = 25.0` **and** count ≥ `HOTSPOT_MIN_OBSERVATIONS = 3`. Returns typed `HotspotResult[]`. **Pure function — no Supabase calls, no side effects.** |
| `src/hooks/useOnline.ts` | Custom React hook — returns `boolean` via `window.addEventListener('online'/'offline')`. Used by `OfflineBanner`. |

### Infrastructure

| File | What it does |
|---|---|
| `.github/workflows/ci.yml` | GitHub Actions CI — runs on every PR to `main`: install, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`. All must pass before merge. |
| `vercel.json` | Vercel SPA config — `rewrites: [{ source: "/(.*)", destination: "/index.html" }]`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel env vars in the dashboard (not in this file). |

**Key rules:**
- `computeHotspots()` is a pure function — takes data in, returns results out. No side effects. Easy to unit test.
- `getUsers()` and `updateRole()` are rejected by RLS for non-Admin users — always handle the error.
- CI is the merge gate. If CI is red, nothing merges. Keep it green.

---

## Tests

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/unit/hotspot.test.ts` | Hotspot flagged when rate ≥ 25% **and** count ≥ 3 in last 6 months; not flagged when rate < 25%; not flagged when count < 3; not flagged when all observations older than 6 months; boundary: exactly 25.0% and exactly 3 → flagged; `tested = 0` → not flagged (no division by zero) | QR6, QR7, QR8, QR9, QR10, QR11, QR12 |
| `tests/components/ManageUsers.test.tsx` | User list renders all profiles; role dropdown shows current role; changing role calls `updateRole()`; `Toast` shown on success; visitor → redirect to S5; Data Submitter / Analyst → redirect to S10 | T-US11-1, T-US11-2, T-US11-3 |
| `tests/components/ManageSources.test.tsx` | Sources list renders; Admin can add a source (all required fields); success message shown; non-Admin → redirect; non-Admin direct DB insert rejected | T-US12-1, T-US12-2, T-US12-3 |
| `tests/components/Offline.test.tsx` | `OfflineBanner` hidden when online; visible when `window.dispatchEvent(new Event('offline'))`; hides again on `'online'` event; ERR1 text from `messages.ts` is shown | QR4, OQ9 |

**Testing rules:**
- Use Vitest + React Testing Library.
- `tests/unit/hotspot.test.ts` does **not** mock anything — `computeHotspots()` is a pure function. Feed it test data directly.
- Mock `src/api/users.ts` in component tests with `vi.mock()`.
- Use `window.dispatchEvent(new Event('offline'))` to test `useOnline`.
- As DevOps lead, maintain CI config. Vitest's glob `tests/**/*.test.{ts,tsx}` picks up all test files automatically — verify new files are covered.
