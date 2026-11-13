# Lerato Thungo — Product Owner

**GitHub:** `LeratoDaisy`
**Role:** Product Owner — location detail, data sources page, PRD stewardship

> You write frontend screens, backend API calls, and tests.
> See [README.md](./README.md) for the full ownership matrix and anti-conflict rules.

---

## Frontend Work

You own the screens that display area-level detail and explain the data sources behind the platform.

| File | What it does |
|---|---|
| `src/pages/S3_AreaDetail.tsx` | Location detail screen at `/areas/:areaCode` (US3). Shows resistance patterns for the selected area, a list of observations, and the hotspot badge if applicable. Fetches data via `src/api/observations.ts` (Gareth's file — import it, don't edit it). |
| `src/pages/S4_About.tsx` | About / Data Sources screen at `/about` (US5, US13). Lists all data sources from `getDataSources()`, explains the hotspot algorithm, and links to the PRD methodology. |
| `src/components/AboutSection.tsx` | Reusable section wrapper used on S4 — heading + body text + optional icon. |
| `src/components/PatternCard.tsx` | Card showing one antibiotic resistance pattern — drug name, organism, resistance rate, trend arrow. Used on S3 and S2. |

**Tailwind classes you use:** colours and spacing from `tokens.ts`. Do not hardcode hex values. Import from `src/theme/tokens.ts`.

**Data you display (from PRD):**
- `amr_observations` rows grouped by `area_code` → show aggregated resistance rate per drug/organism pair.
- `data_sources` rows → list in S4 with name, description, and URL.

---

## Backend Work

You own the data-sources API call that feeds your S4 screen.

| File | What it does |
|---|---|
| `src/api/sources.ts` | Exports `getDataSources(): Promise<DataSource[]>` (OP6). Calls `.from('data_sources').select('*').order('name')`. Returns typed array using `DataSource` from `src/types/index.ts`. |

**Key rules:**
- Always use the `supabaseClient` from `src/lib/supabase.ts` — never create a second client.
- Use the shared `DataSource` type from `src/types/index.ts`. If you need a new field, ask Lesedi to add it.
- Handle the Supabase error response — throw a typed error that your page can catch and show in an `ErrorPanel` (Gareth's component — import it).

**You also contribute to:**
- The content and accuracy of `supabase/migrations/` seed data for `data_sources` (coordinate with Lesedi on the SQL, but you decide the data values based on the PRD).

---

## Tests

You write the tests that verify the area detail and about screens work correctly end-to-end for a visitor.

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/components/AreaDetail.test.tsx` | Area detail renders resistance cards; hotspot badge shows when threshold met; no badge below threshold; `ErrorPanel` shown on API failure; loading state shown while fetching | T-US3-1, T-US3-2, T-US3-3, T-US3-4 |
| `tests/components/About.test.tsx` | About page renders data source list; each source shows name and URL; methodology section present; hotspot parameters displayed (25%, 3 observations, 6 months); loading and error states | T-US5-1, T-US5-2, T-US5-3, T-US5-4, T-US13-1, T-US13-2, T-US13-3 |

**Testing rules:**
- Use Vitest + React Testing Library.
- Mock `src/api/observations.ts` and `src/api/sources.ts` with `vi.mock()` — never hit the real DB.
- Use `data-testid` attributes for hotspot badge, source list items, and error/loading states so tests are selector-stable.
- Tests must pass for both logged-out (visitor) and logged-in (any role) states — both users can see S3 and S4.
