# Lesedi Modikwe — Tech Lead

**GitHub:** `analystmodikwe`
**Role:** Tech Lead — project architecture, auth, database schema, routing shell, CI health

> You write frontend screens, backend API calls, database migrations, and tests.
> See [README.md](./README.md) for the full ownership matrix and anti-conflict rules.

---

## Frontend Work

You own the authentication screens and the global UI shell.

| File | What it does |
|---|---|
| `src/App.tsx` | React Router v6 routing shell — `<Routes>` tree, `<ProtectedRoute>` wrappers, lazy imports. Everyone adds their `<Route>` here via a small PR that you approve. |
| `src/main.tsx` | Vite entry point — `<React.StrictMode>`, Supabase provider, Tailwind base import. |
| `src/pages/S5_SignIn.tsx` | Sign-in screen (F5). Google OAuth button via Supabase, redirect on success, error Toast on failure. Only visible to unauthenticated visitors (US12). |
| `src/pages/S10_AccessDenied.tsx` | Access-denied screen (S10) — shown to signed-in users who lack the required role (PERM rules). Has a "Go back" link. |
| `src/components/Header.tsx` | Global nav bar — logo, screen links, sign-in/out button, role badge. Collapses to hamburger on mobile. |
| `src/components/ProtectedRoute.tsx` | HOC that wraps admin/submitter routes — reads session, checks role, redirects to S10 or S5 as needed (BR7, BR8). |
| `src/components/Toast.tsx` | Accessible `role="status"` toast for success/error messages (US8 feedback rule). Shared by all pages — import and call `useToast()`. |

**Tailwind classes you use:** colours from `tokens.ts` (e.g. `bg-primary`, `text-secondary`). Do not hardcode hex values.

---

## Backend Work

You own the Supabase client, all auth operations, the shared type definitions, and every database migration.

| File | What it does |
|---|---|
| `src/lib/supabase.ts` | Creates and exports the single `supabaseClient` — reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from env. All API modules import from here. |
| `src/api/auth.ts` | Three exported async functions: `signIn()` (OP1 — Google OAuth), `signOut()` (OP2), `getSession()` (OP3 — returns current user + role from `profiles`). |
| `src/types/index.ts` | Shared TypeScript types: `AmrObservation`, `DataSource`, `Profile`, `Role`, `HotspotResult`, API response wrappers. If a teammate needs a new type, they open a PR here. |
| `src/lib/messages.ts` | Centralised user-facing strings (error messages, labels). No string literals scattered in components — import from here. |
| `supabase/migrations/` | **All** migration SQL files. Schema (tables, columns, constraints), Row Level Security policies, seed data. Follow file naming: `YYYYMMDDHHMMSS_description.sql`. |

**Key rules:**
- Never store secrets in source. Only `VITE_` prefixed env vars in `.env.local` (gitignored).
- RLS must be enabled on every table before the table is used in production (BR6).
- Every migration file must be idempotent — use `IF NOT EXISTS` and `OR REPLACE`.

---

## Tests

You write the auth and schema tests that underpin everyone else's work.

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/integration/schema.test.ts` | Supabase client connects, all three tables exist and return rows, RLS blocks unauthenticated writes | T-SETUP-1, T-SETUP-2 |
| `tests/components/Header.test.tsx` | Header renders logo, nav links visible, sign-out button shown when session active | T-US12-2 |
| `tests/components/SignIn.test.tsx` | Sign-in page renders Google button, `signIn()` called on click, error Toast shown on auth failure | T-US12-1, T-US12-3 |
| `tests/components/ProtectedRoute.test.tsx` | Unauthenticated → redirect to S5; signed-in wrong role → redirect to S10; correct role → renders child | T-PERM-1, T-PERM-2 |
| `tests/unit/security.test.ts` | `getSession()` never leaks tokens in console; session refresh works; `signOut()` clears session | T-US12-4 |

**Testing rules:**
- Use Vitest + React Testing Library.
- Mock Supabase with `vi.mock('../lib/supabase')` — never hit the real DB in unit/component tests.
- Integration tests in `tests/integration/` may use a `.env.test` with the staging project keys (never production).
- Use `data-testid` attributes on interactive elements so tests are selector-stable.
