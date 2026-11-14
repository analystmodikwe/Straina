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
| `src/pages/S3_AreaDetail.tsx` | Location detail screen at `/areas/:areaCode` (US3, US4, US5). Shows resistance patterns for the selected area, potential hotspot status ("potential hotspot" / "not a potential hotspot" / ERR5 insufficient data), and data source attribution with demo label where applicable. Fetches data via `src/api/observations.ts` (Gareth's file — import it, don't edit it). |
| `src/pages/S4_About.tsx` | Data Sources / About screen at `/about` (US5, US13). Lists all data sources from `getDataSources()`, explains the hotspot algorithm, links to methodology. Shows demo label "Demo (synthetic)" beside any demo source. |
| `src/components/AboutSection.tsx` | Reusable section wrapper used on S4 — heading + body text + optional icon. |
| `src/components/PatternCard.tsx` | Card showing one antibiotic resistance pattern — pathogen, antimicrobial, resistance percentage (`isolates_resistant / isolates_tested * 100`), potential hotspot badge. Used on S3 and S2. |

**Data you display (from PRD §11.1):**
- `amr_observations` rows grouped by `area_code` → show aggregated resistance rate per pathogen/antimicrobial pair.
- `data_sources` rows → list in S4 with name, description, and URL. Mark `is_demo = true` sources as "Demo (synthetic)".
- Resistance % = `(isolates_resistant / isolates_tested) * 100`. Never store this — calculate it at display time.

---

## Backend Work

| File | What it does |
|---|---|
| `src/api/sources.ts` | Exports `getDataSources(): Promise<DataSource[]>` (OP6). Calls `.from('data_sources').select('*').order('name')`. Returns typed array using `DataSource` from `src/types/index.ts`. |

**Key rules:**
- Always use `supabaseClient` from `src/lib/supabase.ts` — never create a second client.
- Use the shared `DataSource` type from `src/types/index.ts`. If you need a new field, ask Lesedi.
- Handle the Supabase error response — throw a typed error that your page can catch and show in an `ErrorPanel` (Gareth's component — import it).
- The demo data notice text must come from `src/lib/messages.ts` — exact wording from BR13.

---

## Tests

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/components/AreaDetail.test.tsx` | Area detail renders resistance cards; hotspot badge shows when BR12 threshold met; ERR5 shown when count < 3; "not a potential hotspot" shown when rate < 25%; `ErrorPanel` shown on API failure; loading state shown while fetching | T-US3-1, T-US3-2, T-US3-3, T-US3-4, T-US4-2, T-US4-3, T-US4-4 |
| `tests/components/About.test.tsx` | About page renders data source list; each source shows name and URL; demo sources labelled "Demo (synthetic)"; hotspot methodology section present; loading and error states; no demo data described as real | T-US5-1, T-US5-2, T-US5-3, T-US5-4, T-US13-1, T-US13-2, T-US13-3 |

**Testing rules:**
- Use Vitest + React Testing Library.
- Mock `src/api/observations.ts` and `src/api/sources.ts` with `vi.mock()` — never hit the real DB.
- Use `data-testid` on hotspot badge, source list items, and error/loading states.
- Tests must pass for both visitor (not signed in) and any signed-in role — S3 and S4 are public (BR6).
