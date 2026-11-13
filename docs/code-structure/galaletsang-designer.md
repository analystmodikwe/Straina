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
| `tailwind.config.js` | Extends Tailwind with the token values from `tokens.ts`. Defines `fontFamily: { sans: ['Inter', 'sans-serif'] }` and custom colour palette. |
| `src/index.css` | Tailwind base, components, utilities imports. Any global CSS resets. `@import url(...)` for Inter from Google Fonts. |

### Map Screens

| File | What it does |
|---|---|
| `src/pages/S1_HomeMap.tsx` | Home / Map screen at `/` (US1, US4, US6, US7, US11). Renders a Leaflet map via `react-leaflet`. Pins represent area hotspots — red for active hotspot, grey otherwise. Clicking a pin navigates to S3. Includes `MapLegend`, `DemoNotice` (when no data yet), and `OfflineBanner` (Thami's component — import it). |
| `src/pages/S2_Explore.tsx` | Time Exploration screen at `/explore` (US2). Shows resistance trend over time — slider or date range picker, line chart or animated map replay. Uses `PatternCard` (Lerato's component — import it). |
| `src/components/MapLegend.tsx` | Map legend panel — explains hotspot colours, threshold values (25%, 3 obs, 6 months). Static, no data fetching. |
| `src/components/DemoNotice.tsx` | Banner shown when `amr_observations` table has zero rows — tells visitors the app is in demo mode. Hidden once real data exists. |
| `src/components/UI/Button.tsx` | Shared button component — `variant` prop: `primary`, `secondary`, `danger`. Uses Tailwind classes derived from `tokens.ts`. Exported for use across all pages. |

**Tailwind class rule:** Only use class names defined in `tailwind.config.js`. If you need a new colour or size, add it there first.

**Leaflet note:** Import map tiles lazily. Use `import('leaflet')` dynamic import in `S1_HomeMap.tsx` to avoid SSR issues with Vite. The `react-leaflet` `MapContainer` must have an explicit `height` via Tailwind (`h-[600px]` or `h-screen`).

---

## Backend Work

You do not own a dedicated API file. Your backend contribution is through the map data flow:

- `S1_HomeMap.tsx` calls `getObservations()` from `src/api/observations.ts` (Gareth's file) and `computeHotspots()` from `src/lib/hotspot.ts` (Thami's file) — import both, do not edit them.
- In your tests (see below), you mock those modules and assert that the map renders pins correctly when data has / hasn't crossed the hotspot threshold.

If you need a change to `getObservations()` or `computeHotspots()`, open a PR on Gareth's or Thami's branch and tag them.

---

## Tests

You write the tests that verify the design token system is correct and that the two map screens render as expected.

| File | What it covers | PRD IDs |
|---|---|---|
| `tests/unit/tokens.test.ts` | All token values match the style guide (primary `#0F4C5C`, Inter font, correct spacing scale); `tailwind.config.js` exports the same colour values | T-SETUP-1 |
| `tests/components/MapView.test.tsx` | Map renders without crashing; hotspot pin renders for an area above threshold; no pin (or grey pin) for area below threshold; clicking pin navigates to `/areas/:areaCode`; `DemoNotice` shown when observation count is 0; `MapLegend` is present | T-US1-1, T-US1-2, T-US1-3, T-US1-4, T-US1-5 |
| `tests/components/ExploreTime.test.tsx` | Explore screen renders; date range filter changes visible data; `PatternCard` renders for each result; loading state shown; error state shown when API fails | T-US2-1, T-US2-2, T-US2-3, T-US2-4 |

**Testing rules:**
- Use Vitest + React Testing Library.
- Mock Leaflet: add `vi.mock('react-leaflet')` returning a `<div data-testid="map" />` — RTL can't render canvas.
- Mock `src/api/observations.ts` and `src/lib/hotspot.ts` with `vi.mock()`.
- Use `data-testid` on pins, the legend, and the demo notice so tests are selector-stable.
