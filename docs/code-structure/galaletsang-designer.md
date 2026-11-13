# Galaletsang Modise — Designer

**GitHub:** `galaletsangmodise`
**Role:** Designer — map screens, design system tokens, global styles

> You write frontend screens, the design token system, and tests.
> See [README.md](./README.md) for the full ownership matrix and anti-conflict rules.

---

## Frontend Work

You own the two public map screens and the entire design system (tokens, Tailwind config, global CSS).

### Design System

| File | What it does |
|---|---|
| `src/theme/tokens.ts` | Exports JS/TS design tokens — primary `#0F4C5C`, accent, background, text colours; Inter font size scale; spacing values. All components import colours from here — nobody hardcodes a hex. |
| `tailwind.config.js` | Extends Tailwind **v3.4** with token values from `tokens.ts`. Defines `fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }` and custom colour palette. (Tailwind v3.4 — not v4, which uses a different config format.) |
| `src/index.css` | Tailwind base, components, utilities imports. Inter loaded via `<link>` in `index.html` (not an npm package). |

### Map Screens

| File | What it does |
|---|---|
| `src/pages/S1_HomeMap.tsx` | Home / Map screen at `/` (US1, US4, US5, US13). Renders a Leaflet map via `react-leaflet`. Pins represent area hotspots — potential hotspot styling vs normal. Clicking a pin navigates to S3. Includes `MapLegend`, `DemoNotice` (BR13 — import text from `src/lib/messages.ts`), and `OfflineBanner` (Thami's component — import it). |
| `src/pages/S2_Explore.tsx` | Map Exploration screen at `/explore` (US2, US3, US4). Period selector + map replay. Uses `PatternCard` (Lerato's component — import it). |
| `src/components/MapLegend.tsx` | Map legend panel — explains hotspot colours and threshold values (25%, ≥ 3 observations, 6-month window per BR12). Static, no data fetching. |
| `src/components/DemoNotice.tsx` | Strip shown whenever any displayed record has `is_demo = true` (BR13). Text comes from `src/lib/messages.ts`. Do not hardcode the notice text in this component. |
| `src/components/UI/Button.tsx` | Shared button component — `variant` prop: `primary`, `secondary`, `danger`. Uses Tailwind classes derived from `tokens.ts`. Exported for use across all pages. |

**Tailwind class rule:** Only use class names defined in `tailwind.config.js`. If you need a new colour or size, add it there first.

**Leaflet note:** Use `import('leaflet')` dynamic import to avoid SSR issues with Vite. `MapContainer` must have an explicit height via Tailwind (`h-[600px]` or `h-screen`). The `react-leaflet` version is **v5** (plan §4.1).

---

## Backend Work

You do not own a dedicated API file. Your backend contribution is through the map data flow:

- `S1_HomeMap.tsx` calls `getObservations()` from `src/api/observations.ts` (Gareth's file) and `computeHotspots()` from `src/lib/hotspot.ts` (Thami's file) — import both, do not edit them.
- In your tests, you mock those modules and assert that the map renders pins correctly when data has / hasn't crossed the hotspot threshold.
- Your design system (`tokens.ts`, `tailwind.config.js`) is infrastructure that every other team member depends on — this is your backend-equivalent contribution.

If you need a change to `getObservations()` or `computeHotspots()`, open a PR on Gareth's or Thami's branch and tag them.

---

## Tests

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/unit/tokens.test.ts` | All token values match the style guide (primary `#0F4C5C`, Inter font, correct spacing scale); `tailwind.config.js` exports the same colour values | T-SETUP-1 |
| `tests/components/MapView.test.tsx` | Map renders without crashing; hotspot pin renders for an area above BR12 threshold; grey/no pin for area below threshold; demo notice visible when any observation is demo (BR13); clicking pin navigates to `/areas/:areaCode`; `MapLegend` is present; ERR3 shown on load failure | T-US1-1, T-US1-2, T-US1-3, T-US1-4, T-US1-5, T-US13-1 |
| `tests/components/ExploreTime.test.tsx` | Explore screen renders; period selector changes visible data; `PatternCard` renders for each result; loading state shown; ERR2 shown when no data for period; ERR3 shown on API failure | T-US2-1, T-US2-2, T-US2-3, T-US2-4 |

**Testing rules:**
- Use Vitest + React Testing Library.
- Mock Leaflet: `vi.mock('react-leaflet')` returning a `<div data-testid="map" />` — RTL can't render canvas.
- Mock `src/api/observations.ts` and `src/lib/hotspot.ts` with `vi.mock()`.
- Use `data-testid` on pins, the legend, and the demo notice so tests are selector-stable.
