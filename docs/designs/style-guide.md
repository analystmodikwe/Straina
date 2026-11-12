# Straina style guide

**Status: Proposed.** The PRD (Section 18) leaves all visual values open, so these are a proposal by the designer for Galaletsang to confirm (OQ5). When confirmed, copy them into PRD Section 18. Rules from the PRD are marked with their reference.

**Concept:** calm, clinical and trustworthy. A deep teal brand colour for public-health credibility, quiet slate neutrals so the map and data lead, and one warm burnt-orange reserved for "Potential hotspot" so it is the only warm colour on screen. Violet is used only for the demo notice so demo data is never mistaken for real data (BR13).

## 1. Rules from the PRD

- Web app, desktop and phone widths (QR1). Light mode only; dark mode is not decided.
- WCAG 2.1 level AA (Section 15, Proposed): text 4.5:1, large text and controls 3:1, visible keyboard focus.
- Never colour alone: a potential hotspot always has the words "Potential hotspot" plus a hatch pattern plus colour.
- Missing data is never drawn as zero (BR5).
- Say "potential hotspot", never "confirmed outbreak" (BR3). No medical advice.
- Map: standard OpenStreetMap tiles through Leaflet; tiles are not restyled (Section 18).
- Styling in Tailwind CSS (Section 12.3, Proposed), so values below map to a Tailwind theme.

## 2. Colours

| Role | Hex | Contrast (checked) | Use |
|---|---|---|---|
| Primary | `#0F4C5C` | 9.5:1 with white text | Primary buttons, wordmark, "area with data" markers |
| Primary hover | `#0B3A47` | — | Primary button hover |
| Secondary | `#334155` | — | Secondary text buttons, headings in cards |
| Accent (links, focus ring) | `#0369A1` | 5.9:1 on white | Links, 2px focus ring with 2px offset |
| Background | `#F8FAFC` | — | Page background |
| Surface | `#FFFFFF` | — | Cards, header, form, panels |
| Text | `#0F172A` | 17:1 on background | Body and headings |
| Text muted | `#475569` | 7.6:1 on white | Helper text, placeholders in `[brackets]`, labels |
| Border (decorative) | `#CBD5E1` | — | Card and divider lines |
| Control border | `#64748B` | 4.8:1 on white | Input, dropdown and switch outlines |
| Error | text `#B42318` on `#FEF3F2` | 6.1:1 | ERR2–ERR14 messages, field errors (border `#B42318`) |
| Offline banner | text `#7A2E0E` on `#FEF0C7` | 8.3:1 | ERR1 |
| Demo notice strip | text `#4C1D95` on `#EDE9FE` | 9.2:1 | BR13 notice and "Demo (synthetic)" tag |
| Success | text `#085D3A` on `#DCFAE6` | 7.2:1 | "Record saved." toast |
| Potential hotspot | `#C2410C` (label text `#9A3412` on `#FFEDD5`) | 5.2:1 / 6.4:1 | Marker fill with diagonal hatch, label chip |
| Not a potential hotspot | `#2F7F9E` | 3.7:1 on map grey | Marker fill, solid, no hatch |
| Insufficient data | `#475569` dashed outline, fill `#E2E8F0` | 7.6:1 | Marker, ERR5 message |
| No data | `#64748B` outline, hollow (no fill) | 4.8:1 | Marker; never drawn as 0 |
| Disabled control | fill `#E2E8F0`, text `#64748B` | — | Save, Add, Edit, Delete, Sign in while offline |

## 3. Fonts

One family keeps the UI consistent: **Inter** (Google Fonts), fallback `system-ui, sans-serif`. Use tabular numbers for counts and percentages.

| Use | Size / line height | Weight | Tailwind |
|---|---|---|---|
| Page title | 30 / 36 px | 600 | `text-3xl font-semibold` |
| Section heading | 20 / 28 px | 600 | `text-xl font-semibold` |
| Body | 16 / 24 px | 400 | `text-base` |
| Label (fields, rows) | 14 / 20 px | 500 | `text-sm font-medium` |
| Button | 14 / 20 px | 600 | `text-sm font-semibold` |
| Helper text, legend, tags | 12 / 16 px | 500 | `text-xs font-medium` |
| Wordmark "Straina" | 20 / 28 px | 700 | `text-xl font-bold` |

## 4. Spacing, radius, shadows, icons

- **Spacing:** 4 px base, Tailwind scale: 4, 8, 12, 16, 24, 32, 48. Page gutter 16 (phone) and 24–32 (desktop). Gap between form fields 16. Card padding 24 (16 on phone). Content column max width 960 for text pages, 640 for the form, 400 for the sign-in card.
- **Corner radius:** 6 px for buttons, fields and dropdowns; 12 px for cards, panels and the legend; fully rounded for tags and chips.
- **Shadows:** cards and legend `0 1px 2px rgba(15,23,42,0.08)`; popovers and the toast `0 4px 12px rgba(15,23,42,0.12)`. No other shadows.
- **Icons:** Lucide, 20 px, 1.5 px stroke, colour `#475569` (white on primary buttons). Used only where a control needs one (zoom in, zoom out, offline, close).
- **Controls:** minimum height 40 px (44 px on phone); focus ring as in the colour table.
- **Header:** white surface, 1 px bottom border `#CBD5E1`, height 64 px (56 on phone).

## 5. Components (copy from the PRD)

| Component | Text | PRD ref |
|---|---|---|
| Demo notice strip | Demo data — simulated (synthetic) for demonstration. Not real surveillance data. | BR13 |
| Demo source tag / name | Demo (synthetic) / Straina demo dataset (synthetic) | US13, 11.5 |
| Offline banner | You appear to be offline. Please check your connection and try again. | ERR1 |
| No data | No data are available for this selection. | ERR2 |
| Load error | We couldn't load the latest data. Please try again. | ERR3 |
| Unknown error | Something went wrong. Please try again. | ERR4 |
| Insufficient hotspot data | There is not enough data to identify a potential hotspot here. | ERR5 |
| Sign-in failed | Email or password is incorrect. | ERR7 |
| Session expired | Your session has expired. Please sign in again. | ERR8 |
| Wrong role | You don't have permission to open this page. | ERR9 |
| Not signed in | Please sign in to continue. | ERR10 |
| Action not allowed | You don't have permission to do this. | ERR11 |
| Save failed | We couldn't save your changes. Please try again. | ERR12 |
| Required field | This field is required. | ERR13 |
| Resistant too high | Resistant isolates can't be more than tested isolates. | ERR14 |
| Loading / signing in | Loading… / Signing in… | Section 10, S5 |
| Toasts | Record saved. / Record deleted. / Role updated. / Data source saved. | Flows 7–8, S8, S9 |
| Non-diagnostic statement | Straina is a surveillance and information tool, not a diagnostic or treatment tool. | 1.4 |

## 6. Map markers

| State | Style |
|---|---|
| Area with data | Solid `#0F4C5C` circle, white 2 px outline |
| Potential hotspot | `#C2410C` circle with white diagonal hatch, white 2 px outline, plus the label "Potential hotspot" |
| Not a potential hotspot | Solid `#2F7F9E` circle, white 2 px outline |
| Insufficient data | `#E2E8F0` fill, dashed `#475569` outline |
| No data | Hollow circle, solid `#64748B` outline |
| Selected | Extra 3 px `#0369A1` ring around any marker |

Markers do not scale or shade by resistance percentage; resistance is shown on selection.
