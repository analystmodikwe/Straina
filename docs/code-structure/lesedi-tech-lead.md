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
| `src/App.tsx` | React Router **v7** routing shell — `<Routes>` tree, `<ProtectedRoute>` wrappers, lazy imports. Everyone adds their `<Route>` here via a small PR that you approve. |
| `src/main.tsx` | Vite entry point — `<React.StrictMode>`, Supabase provider, Tailwind base import. |
| `src/pages/S5_SignIn.tsx` | Sign-in screen (F8). **Email and password** form via Supabase Auth — no OAuth. Only visible to unauthenticated visitors; a signed-in user who opens `/sign-in` is sent to S1. Error handling: empty field → ERR13 beside the field; wrong credentials → ERR7; success → S1 (or the originally requested page if the role may open it). |
| `src/pages/S10_AccessDenied.tsx` | Access-denied screen (S10) — shown to a signed-in user whose role may not open the requested page. Shows ERR9 and a "Back to map" link → S1. Visitor who hits this route → redirect to S5. |
| `src/components/Header.tsx` | Global nav bar — wordmark, nav links (S1, S2, S4), "Sign in" for visitors, role badge + "Sign out" for signed-in users. Collapses on mobile. |
| `src/components/ProtectedRoute.tsx` | Route guard: reads session and role from `useAuth()`. Unauthenticated → redirect to S5. Wrong role → redirect to S10. Correct role → renders child. |
| `src/components/Toast.tsx` | Accessible `role="status"` toast for success messages (e.g. "Record saved."). Shared by all pages — import and call `useToast()`. |
| `src/hooks/useAuth.ts` | Auth context hook — exposes `{ user, role, session, loading }`. Wraps Supabase's `onAuthStateChange`. Used by `ProtectedRoute` and `Header`. |

**Router version:** React Router **v7** (not v6). Import from `react-router-dom`.

---

## Backend Work

You own the Supabase client, all auth operations, the shared type definitions, and every database migration.

| File | What it does |
|---|---|
| `src/lib/supabase.ts` | Creates and exports the single `supabaseClient` — reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from env. All API modules import from here. |
| `src/api/auth.ts` | Three exported async functions: `signIn(email, password)` (OP1 — Supabase email+password, **not OAuth**), `signOut()` (OP2), `getSession()` (OP3 — returns current user + role from `profiles`). |
| `src/types/index.ts` | Shared TypeScript types: `AmrObservation`, `DataSource`, `Profile`, `Role` (`'admin' \| 'data_submitter' \| 'analyst'`), `HotspotResult`, API response wrappers. If a teammate needs a new type, they open a PR here. |
| `src/lib/messages.ts` | Centralised user-facing strings — exact wording from PRD. ERR1 through ERR14. Never put string literals in components — import from here. |
| `supabase/migrations/` | **All** migration SQL files. Schema (tables, columns, constraints), Row Level Security policies, seed/demo data. File naming: `YYYYMMDDHHMMSS_description.sql`. |

**Key rules:**
- Never store secrets in source. Only `VITE_` prefixed env vars in `.env.local` (gitignored).
- RLS must be enabled on every table before the table is used in production (BR6).
- Every migration file must be idempotent — use `IF NOT EXISTS` and `OR REPLACE`.
- Sign-in is **email + password only**. No Google OAuth, no magic links, no social login (PRD §8.4, §3.3 deferred list).

---

## Tests

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/integration/schema.test.ts` | Supabase client connects; all three tables exist and return rows; RLS blocks unauthenticated writes | T-SETUP-1, T-SETUP-2 |
| `tests/components/Header.test.tsx` | Header renders wordmark + nav links for visitor; shows "Sign in"; shows role badge + "Sign out" when session active | T-US7-1 |
| `tests/components/SignIn.test.tsx` | Renders email + password fields; empty field → ERR13 shown, no request sent; wrong creds → ERR7; success → redirect to S1 | T-US6-1, T-US6-2, T-US6-3 |
| `tests/components/ProtectedRoute.test.tsx` | Unauthenticated → redirect to S5; signed-in wrong role → redirect to S10; correct role → renders child; back-button after sign-out blocked | T-US7-2, T-PERM-1a, T-PERM-1b |
| `tests/unit/security.test.ts` | `getSession()` never leaks tokens; `signOut()` clears session; session expiry triggers redirect to S5 + ERR8 | T-US6-4, T-PERM-2a, T-PERM-2b |

**Testing rules:**
- Use Vitest + React Testing Library.
- Mock Supabase with `vi.mock('../lib/supabase')` — never hit the real DB in unit/component tests.
- Integration tests in `tests/integration/` use `.env.test` with staging project keys (never production).
- Use `data-testid` attributes on interactive elements so tests are selector-stable.
