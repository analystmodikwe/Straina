# Gareth Motloutsi — QA / Test Lead

**GitHub:** `GarethMalekaMotloutsi`
**Role:** QA / Test Lead — record management screens, form validation, observations API, RLS integration tests

> You write frontend screens, backend API calls, and tests.
> See [README.md](./README.md) for the full ownership matrix and anti-conflict rules.

---

## Frontend Work

You own the record management screens (create, edit, list) and the shared form UI components used across the whole app.

### Record Screens

| File | What it does |
|---|---|
| `src/pages/S6_RecordForm.tsx` | Record form screen at `/records/new` and `/records/:id/edit` (US6, US7, US8). Form with antibiotic, organism, resistance rate, area, date, and data source fields. Calls `createObservation()` or `updateObservation()` on submit. Validates with Zod schema from `src/lib/validation.ts`. Shows `Toast` on success/failure. |
| `src/pages/S7_RecordList.tsx` | Record list screen at `/records` (US9, US10). Table of all `amr_observations` rows. Admin sees all; Submitter sees own. Each row has Edit and Delete buttons. Delete triggers `DeleteConfirmModal`. Paginates at 50 rows. |

### Shared UI Components

| File | What it does |
|---|---|
| `src/components/UI/TextField.tsx` | Reusable text/number input — `label`, `name`, `error` props. Used in S6 and any future form. `data-testid` on input and error message. |
| `src/components/UI/SelectField.tsx` | Reusable `<select>` — `label`, `name`, `options`, `error` props. Used in S6 for antibiotic, organism, area, source. |
| `src/components/UI/Modal.tsx` | Accessible modal shell — `isOpen`, `onClose`, `title`, `children`. Traps focus, closes on Esc. Used by `DeleteConfirmModal`. |
| `src/components/ErrorPanel.tsx` | Full-width error display — icon + message + optional retry button. Used by all pages on API failure. Import it rather than writing your own error UI. |
| `src/components/DeleteConfirmModal.tsx` | Confirmation modal for record deletion — "Are you sure?" with Cancel and Delete (danger) buttons. Calls `deleteObservation()` on confirm. |
| `src/components/RecordRow.tsx` | A single `<tr>` in the record list table — antibiotic, organism, rate, area, date, source, Edit/Delete action buttons. |

---

## Backend Work

You own the observations API and the shared validation schema.

| File | What it does |
|---|---|
| `src/api/observations.ts` | Four exported async functions: `getObservations(filters)` (OP4 — public + authenticated), `createObservation(data)` (OP7), `updateObservation(id, data)` (OP8), `deleteObservation(id)` (OP9). Uses `supabaseClient` from `src/lib/supabase.ts`. All return typed results using `AmrObservation` from `src/types/index.ts`. |
| `src/lib/validation.ts` | Zod v4 schemas: `ObservationSchema` (validates the record form fields — resistance rate 0–100, required antibiotic, organism, area, date, source). Exports `validateObservation(data)` — called in S6 before API submission. |

**Key rules:**
- `getObservations()` must work for unauthenticated users (public read RLS) and authenticated users. Apply filters for `area_code`, `antibiotic`, `organism`, `date_range` as optional params.
- `createObservation()` and `updateObservation()` require an active session (Supabase will reject if not authenticated — handle the error).
- Use the shared types from `src/types/index.ts`. If you need a new field on `AmrObservation`, open a PR tagging Lesedi.

---

## Tests

You write the most critical test suite — form validation, record CRUD, and RLS enforcement.

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/unit/validation.test.ts` | Valid observation passes schema; resistance rate below 0 fails; above 100 fails; missing required fields fail; empty string fails; Zod error messages are human-readable | T-EC4-1, T-EC6-1 |
| `tests/components/RecordForm.test.tsx` | Form renders all fields; submit calls `createObservation()`; Zod errors shown inline; success → Toast + redirect; API failure → Toast error; edit mode pre-fills existing values; `updateObservation()` called on edit submit | T-US6-1, T-US6-2, T-US6-3, T-US7-1, T-US7-2, T-EC7-1, T-EC8-1 |
| `tests/components/RecordList.test.tsx` | List renders rows; Admin sees all rows; Submitter sees only own rows; Delete button opens `DeleteConfirmModal`; confirming delete calls `deleteObservation()`; cancelling does not; pagination renders at 50+ rows | T-US9-1, T-US9-2, T-US10-1, T-US10-2, T-EC5-1 |
| `tests/integration/rls.test.ts` | Unauthenticated insert rejected; Submitter can insert own row; Submitter cannot update another user's row; Admin can update any row; Admin can delete any row; Submitter cannot delete another user's row | T-PERM-1b, T-PERM-2, QR2, QR3 |

**Testing rules:**
- Use Vitest + React Testing Library.
- Mock `src/api/observations.ts` in component tests with `vi.mock()`.
- Integration tests in `tests/integration/rls.test.ts` use a staging Supabase project — read keys from `.env.test` (never committed).
- Every interactive element in your components must have `data-testid` so your own tests (and future tests) are selector-stable.
- As QA Lead, you also review teammates' test files in PRs and ensure test IDs from the PRD are covered. If you spot a missing test ID, open an issue.
