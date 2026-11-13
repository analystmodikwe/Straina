# Thami Sithole — DevOps / Release

**GitHub:** `ThamiRoneo`
**Role:** DevOps / Release — admin screens, hotspot logic, CI/CD pipeline, Vercel deployment

> You write frontend screens, backend API calls, and tests.
> See [README.md](./README.md) for the full ownership matrix and anti-conflict rules.

---

## Frontend Work

You own the admin management screens and the offline-state banner.

| File | What it does |
|---|---|
| `src/pages/S8_ManageUsers.tsx` | Manage Users screen at `/admin/users` (US14, US15). Lists all `profiles` rows — name, email, current role. Admin can toggle role between `admin`, `submitter`, and `viewer`. Calls `getUsers()` and `updateRole()` from `src/api/users.ts`. Shows `Toast` on success/failure. Protected: Admin only (wrap with `ProtectedRoute` from Lesedi). |
| `src/pages/S9_ManageSources.tsx` | Manage Sources screen at `/admin/sources` (US16, US17). Lists all `data_sources` rows. Admin can add or deactivate a source. Calls `getDataSources()` from `src/api/sources.ts` (Lerato's file — import it, don't edit it) and your own `users.ts` for any write operations on sources (or coordinate with Lerato to add a write function to `sources.ts`). |
| `src/components/OfflineBanner.tsx` | Full-width banner shown when `useOnline()` returns `false`. Displays: "You are offline. Data may be out of date." Uses `src/hooks/useOnline.ts`. Imported by `src/App.tsx` (Lesedi's file — Lesedi adds the import in a small PR). |

**Tailwind classes:** Use classes from `tailwind.config.js` only. No hardcoded colours.

---

## Backend Work

You own the users API, the hotspot calculation logic, the online-state hook, and all infrastructure config.

### Application Code

| File | What it does |
|---|---|
| `src/api/users.ts` | Two exported async functions: `getUsers(): Promise<Profile[]>` (OP10 — reads `profiles` table, Admin only), `updateRole(userId, role): Promise<void>` (OP11 — updates `profiles.role`, Admin only). Uses `supabaseClient` from `src/lib/supabase.ts`. |
| `src/lib/hotspot.ts` | Exports `computeHotspots(observations: AmrObservation[]): HotspotResult[]` (BR12). Implements: filter to last `HOTSPOT_WINDOW_MONTHS = 6` months; group by `area_code` + antibiotic; compute resistance rate; flag as hotspot if rate ≥ `HOTSPOT_THRESHOLD_PCT = 25.0` **and** count ≥ `HOTSPOT_MIN_OBSERVATIONS = 3`. Returns typed `HotspotResult[]`. Pure function — no Supabase calls. |
| `src/hooks/useOnline.ts` | Custom React hook — returns `boolean` via `window.addEventListener('online'/'offline')`. Used by `OfflineBanner`. |

### Infrastructure

| File | What it does |
|---|---|
| `.github/workflows/ci.yml` | GitHub Actions CI — runs on every PR to `main`: `pnpm install`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`. All must pass before merge. |
| `vercel.json` | Vercel deployment config — sets `rewrites: [{ source: "/(.*)", destination: "/index.html" }]` for SPA routing. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables (not in this file). |

**Key rules:**
- `computeHotspots()` is a pure function — takes data in, returns results out. No side effects, no API calls. This makes it easy to unit test.
- `getUsers()` and `updateRole()` will be rejected by Supabase RLS for non-Admin users — always handle the error and show it via `Toast`.
- The CI pipeline is the gate for every merge. If CI is red, nothing merges. Keep it green.

---

## Tests

You write tests for the hotspot algorithm, admin screens, and the offline banner.

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/unit/hotspot.test.ts` | Hotspot flagged when rate ≥ 25% **and** count ≥ 3 in last 6 months; not flagged when rate < 25%; not flagged when count < 3; not flagged when all observations are older than 6 months; boundary values (exactly 25.0%, exactly 3 observations) | QR6, QR7, QR8, QR9, QR10, QR11, QR12 |
| `tests/components/ManageUsers.test.tsx` | User list renders all profiles; role dropdown shows current role; changing role calls `updateRole()`; Toast shown on success; non-Admin cannot access page (redirected by `ProtectedRoute`) | T-US14-1, T-US14-2, T-US15-1 |
| `tests/components/ManageSources.test.tsx` | Sources list renders; Admin can add a source (form + submit); deactivate action calls correct API; non-Admin cannot access page | T-US16-1, T-US17-1 |
| `tests/components/Offline.test.tsx` | `OfflineBanner` hidden when online; visible when `window.dispatchEvent(new Event('offline'))`; hides again when back online | QR4, OQ9 |

**Testing rules:**
- Use Vitest + React Testing Library.
- `tests/unit/hotspot.test.ts` does **not** mock anything — `computeHotspots()` is a pure function. Feed it test data directly.
- Mock `src/api/users.ts` in component tests with `vi.mock()`.
- Use `vi.spyOn(window, 'addEventListener')` or `window.dispatchEvent(new Event('offline'))` to test `useOnline`.
- As DevOps lead, you also maintain the CI config. If a teammate adds a new test file, make sure `pnpm run test` picks it up automatically (Vitest's glob pattern covers `tests/**/*.test.{ts,tsx}`).
