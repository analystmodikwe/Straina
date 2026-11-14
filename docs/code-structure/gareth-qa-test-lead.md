# Gareth Motloutsi — QA / Test Lead

**GitHub:** `GarethMalekaMotloutsi`
**Role:** QA / Test Lead — record management screens, form validation, observations API, RLS integration tests

> You write frontend screens, backend API calls, and tests.
> See [README.md](./README.md) for the full ownership matrix and anti-conflict rules.

---

## Frontend Work

You own the record management screens (view, submit, edit, delete) and the shared form UI components.

### Record Screens

| File | What it does |
|---|---|
| `src/pages/S6_RecordForm.tsx` | Submit / Edit record screen at `/records/new` and `/records/:recordId/edit` (US8, US9). Form fields per PRD §11.1: data source (selector), pathogen (text), antimicrobial (text), area code (text), observation period (date), `isolates_tested` (number), `isolates_resistant` (number). Validation: `isolates_resistant > isolates_tested` → ERR14; empty required field → ERR13. Calls `createObservation()` or `updateObservation()`. Shows `Toast` on success; keeps form values on API failure (ERR12). |
| `src/pages/S7_RecordList.tsx` | Records list screen at `/records` (US9, US10). Table of `amr_observations`. Admin sees all; Data Submitter sees own. Edit and Delete buttons appear only where the role allows (BR8, BR9). Delete triggers `DeleteConfirmModal` with copy: "Delete this record? This cannot be undone." |

> **Field names (PRD §11.1):** `data_source_id`, `pathogen`, `antimicrobial`, `area_code`, `observation_period`, `isolates_tested`, `isolates_resistant`. **Not** a "resistance rate 0–100" field — resistance % is always calculated at display time as `(isolates_resistant / isolates_tested) * 100`, never stored.

### Shared UI Components

| File | What it does |
|---|---|
| `src/components/UI/TextField.tsx` | Reusable text/number input — `label`, `name`, `error` props. Used in S6. `data-testid` on input and error message. |
| `src/components/UI/SelectField.tsx` | Reusable `<select>` — `label`, `name`, `options`, `error` props. Used in S6 for data source. |
| `src/components/UI/Modal.tsx` | Accessible modal shell — `isOpen`, `onClose`, `title`, `children`. Traps focus, closes on Esc. Used by `DeleteConfirmModal`. |
| `src/components/ErrorPanel.tsx` | Full-width error display — icon + message from `src/lib/messages.ts` + optional retry button. Used by all pages on API failure. Import this, do not write your own error UI. |
| `src/components/DeleteConfirmModal.tsx` | Confirmation modal — exact copy "Delete this record? This cannot be undone." (PRD Flow 8) with Cancel and Delete (danger) buttons. Calls `deleteObservation()` on confirm. |
| `src/components/RecordRow.tsx` | A single `<tr>` in the records table — pathogen, antimicrobial, calculated resistance %, area, period, source, Edit/Delete action buttons (shown only where role allows). |

---

## Backend Work

You own the observations API and form validation.

| File | What it does |
|---|---|
| `src/api/observations.ts` | Four exported async functions: `getObservations(filters?)` (OP4 — public + authenticated read), `createObservation(data)` (OP7), `updateObservation(id, data)` (OP8), `deleteObservation(id)` (OP9). All use `supabaseClient` from `src/lib/supabase.ts` and return `AmrObservation` from `src/types/index.ts`. |
| `src/lib/validation.ts` | **Zod v4** schemas. `ObservationSchema` validates S6 form fields: `isolates_tested` ≥ 1; `isolates_resistant` ≥ 0 and **≤ `isolates_tested`** (not "0–100" rate — PRD §US8-3, ERR14); all required fields present. Exports `validateObservation(data)`. |

**Key rules:**
- Validation rule: `isolates_resistant` **cannot exceed** `isolates_tested`. If it does → ERR14. This is the PRD rule, not "resistance rate between 0 and 100".
- `getObservations()` works for unauthenticated visitors (public RLS). Pass optional `{ areaCode, pathogen, antimicrobial, startDate, endDate }` filters.
- `createObservation()` and `updateObservation()` require an active session — handle the rejection gracefully.
- Use `AmrObservation` type from `src/types/index.ts`. To add a field, open a PR tagging Lesedi.

---

## Tests

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/unit/validation.test.ts` | Valid observation passes schema; `isolates_resistant > isolates_tested` → ERR14; `isolates_resistant < 0` → error; `isolates_tested < 1` → error; missing required fields → ERR13; Zod errors are human-readable | T-US8-2, T-US8-3, T-EC4-1, T-EC6-1 |
| `tests/components/RecordForm.test.tsx` | Form renders all PRD §11.1 fields; empty required field → ERR13 inline, no request sent; `isolates_resistant > isolates_tested` → ERR14 inline; success → Toast + redirect to S7; API failure → ERR12, form values kept; edit mode pre-fills values; `updateObservation()` called on edit submit; visitor → redirect to S5; Analyst → redirect to S10 | T-US8-1, T-US8-2, T-US8-3, T-US8-4, T-US9-1, T-EC7-1, T-EC8-1 |
| `tests/components/RecordList.test.tsx` | List renders rows; Admin sees all rows; Data Submitter sees own rows only; Delete opens `DeleteConfirmModal`; confirming delete calls `deleteObservation()`; cancelling does not; Data Submitter has no Edit/Delete on another person's row | T-US9-2, T-US10-1, T-US10-2, T-US10-3, T-US10-4, T-EC5-1 |
| `tests/integration/rls.test.ts` | Unauthenticated insert rejected (T-PERM-2b); Data Submitter inserts own row; Data Submitter cannot update another user's row (T-PERM-3b); Admin updates any row (T-PERM-3a); Admin deletes any row; Data Submitter cannot delete another user's row | T-PERM-2b, T-PERM-3a, T-PERM-3b, QR2, QR3 |

**Testing rules:**
- Use Vitest + React Testing Library.
- Mock `src/api/observations.ts` in component tests with `vi.mock()`.
- Integration tests use staging Supabase keys from `.env.test` (never committed).
- Every interactive element must have `data-testid` for selector-stable tests.
- As QA Lead: review teammates' test files in PRs. If a PRD test ID is missing anywhere, open an issue.
