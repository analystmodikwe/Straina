# Straina — Google Stitch prompts

Built only from `docs/PRD.md` (v1.0 final draft candidate, 11 Nov 2026). Every label, message and notice is copied from the PRD. Anything the PRD does not say is a `[placeholder]` or is listed in **Questions** at the end.

## How to use

1. Paste prompt 00 first. The values in it are a proposal (see `style-guide.md`); generate the style guide frame and keep it in the same Stitch project.
2. For prompts 01 to 08, paste the **whole** block (the shared header is repeated in each one on purpose). Generate the desktop frames first.
3. Phone width (QR1): after each screen is approved, send this follow-up: `Create a phone-width version of every frame in this screen. Same copy, same states, same components; stack columns vertically; keep the legend and notices visible.`
4. Export and rename the main image `NN-name.png` (the names below). Name state frames `NN-name--state.png`, for example `02-map--offline.png`.
5. Put the images and the README in `docs/designs/`.

**Screen mapping.** The PRD has no separate screen for F4 or F6. Prompt 05 is S2 with the hotspot layer on; prompts 06 and 07 are two parts of S4 (`/about`). See Question 2.

---

## Prompt 00 — Style guide

File: `00-style-guide.png`
```text
Create one style guide frame named "00-style-guide" for Straina, a web app for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. It is a surveillance and information tool, not a diagnostic or treatment tool. Use only the values given here. Use the values listed under VALUES.

RULES THAT ARE GIVEN
- Web app, desktop and phone widths. Design light mode only (dark mode is not decided).
- Accessibility target: WCAG 2.1 level AA. Readable text, sufficient colour contrast, meaningful labels, visible keyboard focus.
- Information is never carried by colour alone. A potential hotspot uses the words "Potential hotspot" plus a hatch pattern plus colour.
- The map uses standard OpenStreetMap tiles (Leaflet). Do not restyle the map tiles; style only the markers, legend and controls on top of it.
- The code will use Tailwind CSS, so express spacing, type sizes and radius as a consistent scale that can become design tokens.

VALUES (use exactly these, do not substitute)
- Concept: calm, clinical, trustworthy public-health tool. Quiet neutrals so the map and data lead. One warm colour only, reserved for "Potential hotspot".
- Colours: Primary #0F4C5C (hover #0B3A47). Secondary #334155. Accent for links and focus ring #0369A1. Background #F8FAFC. Surface #FFFFFF. Text #0F172A. Muted text #475569. Decorative border #CBD5E1. Control border #64748B.
- Status colours: Error text #B42318 on #FEF3F2. Offline banner text #7A2E0E on #FEF0C7. Demo notice text #4C1D95 on #EDE9FE. Success text #085D3A on #DCFAE6. Disabled fill #E2E8F0 with text #64748B.
- Map markers (circles with a white 2px outline): area with data solid #0F4C5C; Potential hotspot #C2410C with white diagonal hatch; Not a potential hotspot solid #2F7F9E; insufficient data fill #E2E8F0 with dashed #475569 outline; No data hollow with solid #64748B outline; selected adds a 3px #0369A1 ring. Potential hotspot label chip: text #9A3412 on #FFEDD5.
- Typeface: Inter for everything (fallback system sans-serif), tabular numbers for counts and percentages. Sizes: page title 30/36 semibold; section heading 20/28 semibold; body 16/24 regular; label 14/20 medium; button 14/20 semibold; helper text, legend and tags 12/16 medium; wordmark "Straina" 20/28 bold.
- Spacing: 4px base scale (4, 8, 12, 16, 24, 32, 48). Card padding 24; gap between form fields 16; controls at least 40px tall.
- Corner radius: 6px for buttons, fields and dropdowns; 12px for cards, panels and the legend; fully rounded for tags and chips.
- Shadows: cards and legend 0 1px 2px rgba(15,23,42,0.08); popovers and toast 0 4px 12px rgba(15,23,42,0.12). No other shadows.
- Icons: Lucide, 20px, 1.5px stroke, #475569 (white on primary buttons), used only for zoom in, zoom out, offline and close.
- Header: white, 1px bottom border #CBD5E1, 64px tall.

ROLES THAT NEED A COLOUR (assign one swatch each, using the values above): error message, offline banner, demo notice strip, success message, potential hotspot, not a potential hotspot, insufficient data, no data, disabled control.

SHOW THESE COMPONENTS WITH THEIR EXACT COPY
- Header: wordmark "Straina", links "Explore" and "About / Data sources", button "Sign in"; signed-in version with the role label "Data Submitter" and button "Sign out".
- Buttons: primary "Sign in", secondary "Cancel", "Try again", and a disabled version.
- Text field: normal, focused, and error with the message "This field is required."; dropdown; on/off switch labelled "Potential hotspots".
- Offline banner: "You appear to be offline. Please check your connection and try again."
- Demo notice strip: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Tag: "Demo (synthetic)".
- Status labels: "Potential hotspot" (with hatch pattern), "Not a potential hotspot", and "There is not enough data to identify a potential hotspot here."
- Panels: empty "No data are available for this selection."; error "We couldn't load the latest data. Please try again." with "Try again"; loading placeholder blocks with "Loading…".
- Toast: "Record saved."
- Map legend with markers for: area with data, Potential hotspot, Not a potential hotspot, insufficient data, No data.

Show each colour as a swatch with its hex code and its role, and show the type scale, spacing scale, radius and shadow as labelled specimens.
```

---

## Prompt 01 — Sign in — S5, route /sign-in

File: `01-login.png`
```text
PROJECT: Straina, a web app (design the desktop frame first; a phone-width version comes later) for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. Straina is a surveillance and information tool, not a diagnostic or treatment tool.

CONSISTENCY: Reuse the Straina style guide frame "00-style-guide" for every colour, font, type size, spacing step, corner radius and icon. Every screen uses the same header, banners, notices, buttons, fields, cards, loading blocks and toasts described below. Do not add pages, features, buttons, links, filters, charts or copy that are not listed in this prompt.

SHARED COMPONENTS (identical on every screen)
- Header: text wordmark "Straina" at the left (no logo); nav links "Explore" and "About / Data sources"; at the right a "Sign in" button for visitors. A signed-in header shows the role label and a "Sign out" button instead of "Sign in", and is used only where this prompt says so.
- Offline banner (ERR1): full-width strip directly under the header. Text: "You appear to be offline. Please check your connection and try again."
- Demo notice strip (BR13): full-width strip under the header (and under the offline banner if shown) on every screen that displays records. Text, exactly: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Loading: grey placeholder blocks in the shape of the real content, plus the text "Loading…".
- Empty (ERR2): "No data are available for this selection."
- Load error (ERR3): "We couldn't load the latest data. Please try again." with a button "Try again". Unknown error (ERR4): "Something went wrong. Please try again."
- Potential hotspot marking: always the words "Potential hotspot" plus a hatch pattern plus colour. Never colour alone.
- Missing data is never drawn as zero. Areas with no data use a neutral hollow "No data" style, never 0%.

WORDING RULES (apply to every word on screen)
- Say "potential hotspot". Never say "confirmed outbreak", "outbreak", "epidemic", "alert" or "danger".
- No medical advice anywhere: no diagnosis, treatment, dosage or "what you should do" text.
- Demo data is always labelled as demo data on the screen and never described as real.
- Text in [square brackets] is a placeholder. Show it literally in a muted style. Do not invent real place names, organism names, drug names, numbers or dates.

HOW TO OUTPUT: create one frame for the Normal state, then one frame per applicable state listed below, all using the same layout. Title each frame "<screen name> — <state>".


SCREEN: Sign in (S5). Route /sign-in. Opened by visitors only; a signed-in user is sent to the Map. Serves US6 and F8.

LAYOUT (desktop, top to bottom)
1. Minimal header: wordmark "Straina" only. No nav links and no "Sign in" button on this screen.
2. Offline banner slot directly under the header (empty in Normal).
3. Centred card in the middle of the page, containing in order: page title "Sign in"; field with label "Email"; field with label "Password" (masked); one full-width primary button "Sign in".
4. Nothing else. No "Forgot password", no "Create account", no social sign-in, no "Remember me", no demo notice (no records are shown here).

STATES
- Normal: the card as above, both fields empty.
- Loading: the button text becomes "Signing in…" and is disabled; fields stay visible.
- Empty: not applicable, because S5 shows no list.
- Error (draw each as its own frame):
  a) Empty submit: under each empty field, "This field is required." Nothing is sent.
  b) Wrong details: message above the button, "Email or password is incorrect." The user stays on this screen. Do not say which of the two was wrong.
  c) Expired session (shown after a redirect): message at the top of the card, "Your session has expired. Please sign in again."
  d) Visitor sent here from a protected page: message at the top of the card, "Please sign in to continue."
  e) Unknown error: message above the button, "Something went wrong. Please try again."
- Offline: the offline banner appears; the "Sign in" button is disabled.
- Success: no separate on-screen state. The user is redirected to the Map (or the page they asked for). Do not draw a success frame.
```

---

## Prompt 02 — Map — S1, route /

File: `02-map.png`
```text
PROJECT: Straina, a web app (design the desktop frame first; a phone-width version comes later) for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. Straina is a surveillance and information tool, not a diagnostic or treatment tool.

CONSISTENCY: Reuse the Straina style guide frame "00-style-guide" for every colour, font, type size, spacing step, corner radius and icon. Every screen uses the same header, banners, notices, buttons, fields, cards, loading blocks and toasts described below. Do not add pages, features, buttons, links, filters, charts or copy that are not listed in this prompt.

SHARED COMPONENTS (identical on every screen)
- Header: text wordmark "Straina" at the left (no logo); nav links "Explore" and "About / Data sources"; at the right a "Sign in" button for visitors. A signed-in header shows the role label and a "Sign out" button instead of "Sign in", and is used only where this prompt says so.
- Offline banner (ERR1): full-width strip directly under the header. Text: "You appear to be offline. Please check your connection and try again."
- Demo notice strip (BR13): full-width strip under the header (and under the offline banner if shown) on every screen that displays records. Text, exactly: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Loading: grey placeholder blocks in the shape of the real content, plus the text "Loading…".
- Empty (ERR2): "No data are available for this selection."
- Load error (ERR3): "We couldn't load the latest data. Please try again." with a button "Try again". Unknown error (ERR4): "Something went wrong. Please try again."
- Potential hotspot marking: always the words "Potential hotspot" plus a hatch pattern plus colour. Never colour alone.
- Missing data is never drawn as zero. Areas with no data use a neutral hollow "No data" style, never 0%.

WORDING RULES (apply to every word on screen)
- Say "potential hotspot". Never say "confirmed outbreak", "outbreak", "epidemic", "alert" or "danger".
- No medical advice anywhere: no diagnosis, treatment, dosage or "what you should do" text.
- Demo data is always labelled as demo data on the screen and never described as real.
- Text in [square brackets] is a placeholder. Show it literally in a muted style. Do not invent real place names, organism names, drug names, numbers or dates.

HOW TO OUTPUT: create one frame for the Normal state, then one frame per applicable state listed below, all using the same layout. Title each frame "<screen name> — <state>".


SCREEN: Map (S1), the home page. Route /. Open to everyone. Serves F1, US1, US5 and US13.

LAYOUT (desktop, top to bottom)
1. Header (visitor version).
2. Offline banner slot (empty in Normal).
3. Demo notice strip with the exact BR13 text.
4. Intro row above the map with two lines of text: "The purpose of Straina is to provide an accessible web-based way to explore antimicrobial-resistance information geographically and over time." and "Straina is a surveillance and information tool, not a diagnostic or treatment tool." At the right of this row, a primary button "Explore".
5. The map fills the rest of the page width and most of the page height. OpenStreetMap-style base map. Zoom in / zoom out controls at the top-left of the map. Standard OpenStreetMap attribution at the bottom-right of the map.
6. On the map, one marker per area. Areas with data use the "area with data" marker; areas without data use the hollow "No data" marker. Do not colour-scale the markers by resistance and do not draw a hotspot layer on this screen. Draw four to six markers in total.
7. Map legend card (overlaid at the bottom-left of the map) titled "Legend", with two entries: "Area with data" and "No data".
8. Source row under the map: "Data source: Straina demo dataset (synthetic)" with the tag "Demo (synthetic)" and a link "About / Data sources".
9. One marker is selected in a second Normal frame: a small card next to it shows "[Area name]", "[Period start] – [Period end]" and a link "[Area details]" (opens the area page).

STATES
- Normal: as above.
- Loading: the map area is a grey placeholder block with "Loading…"; legend and source row stay visible.
- Empty: no records at all. The ERR2 message "No data are available for this selection." sits centred over the map area. No markers.
- Error: the ERR3 message with "Try again" centred over the map area.
- Offline: the offline banner appears; the last loaded map stays visible below it.
- Success: not applicable, because S1 has no save action.
```

---

## Prompt 03 — Exploring time — S2, route /explore

File: `03-explore-time.png`
```text
PROJECT: Straina, a web app (design the desktop frame first; a phone-width version comes later) for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. Straina is a surveillance and information tool, not a diagnostic or treatment tool.

CONSISTENCY: Reuse the Straina style guide frame "00-style-guide" for every colour, font, type size, spacing step, corner radius and icon. Every screen uses the same header, banners, notices, buttons, fields, cards, loading blocks and toasts described below. Do not add pages, features, buttons, links, filters, charts or copy that are not listed in this prompt.

SHARED COMPONENTS (identical on every screen)
- Header: text wordmark "Straina" at the left (no logo); nav links "Explore" and "About / Data sources"; at the right a "Sign in" button for visitors. A signed-in header shows the role label and a "Sign out" button instead of "Sign in", and is used only where this prompt says so.
- Offline banner (ERR1): full-width strip directly under the header. Text: "You appear to be offline. Please check your connection and try again."
- Demo notice strip (BR13): full-width strip under the header (and under the offline banner if shown) on every screen that displays records. Text, exactly: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Loading: grey placeholder blocks in the shape of the real content, plus the text "Loading…".
- Empty (ERR2): "No data are available for this selection."
- Load error (ERR3): "We couldn't load the latest data. Please try again." with a button "Try again". Unknown error (ERR4): "Something went wrong. Please try again."
- Potential hotspot marking: always the words "Potential hotspot" plus a hatch pattern plus colour. Never colour alone.
- Missing data is never drawn as zero. Areas with no data use a neutral hollow "No data" style, never 0%.

WORDING RULES (apply to every word on screen)
- Say "potential hotspot". Never say "confirmed outbreak", "outbreak", "epidemic", "alert" or "danger".
- No medical advice anywhere: no diagnosis, treatment, dosage or "what you should do" text.
- Demo data is always labelled as demo data on the screen and never described as real.
- Text in [square brackets] is a placeholder. Show it literally in a muted style. Do not invent real place names, organism names, drug names, numbers or dates.

HOW TO OUTPUT: create one frame for the Normal state, then one frame per applicable state listed below, all using the same layout. Title each frame "<screen name> — <state>".


SCREEN: Map exploration (S2). Route /explore. Open to everyone. Serves F2, US2 and US3. This prompt designs the time controls; the potential hotspot layer is shown switched OFF here.

LAYOUT (desktop)
1. Header (visitor version), offline banner slot, demo notice strip with the exact BR13 text.
2. Two columns under the strip. Left column (control panel, narrow): 
   - dropdown labelled "Time period" showing "[Period]"; the open list shows "[Period 1]", "[Period 2]", "[Period 3]";
   - dropdown labelled "Pathogen" showing "[Pathogen name]";
   - dropdown labelled "Antimicrobial" showing "[Antimicrobial name]";
   - on/off switch labelled "Potential hotspots", set to OFF;
   - legend card titled "Legend" with entries "Area with data" and "No data";
   - a link "About / Data sources".
3. Right column: the map (OpenStreetMap-style base, zoom controls top-left, attribution bottom-right) with four to six area markers, using "area with data" and hollow "No data" markers. Do not colour-scale markers by resistance.
4. A second Normal frame shows one area selected: a summary card at the bottom of the left column with "[Area name]", "Time period: [Period start] – [Period end]", "Pathogen: [Pathogen name]", "Antimicrobial: [Antimicrobial name]", "Resistance: [00]%", and a link "[Area details]".

STATES
- Normal: as above (two frames: nothing selected, area selected).
- Loading: map is a grey placeholder with "Loading…"; the three dropdowns and the switch are disabled.
- Empty: the selected period has no records. ERR2 "No data are available for this selection." centred over the map. Dropdowns stay enabled so the user can change the period. No markers are drawn as zero.
- Error: ERR3 with "Try again" centred over the map.
- Offline: offline banner appears; map stays visible.
- Success: not applicable, because S2 has no save action.
```

---

## Prompt 04 — Resistance patterns — S3, route /areas/:areaCode

File: `04-resistance-patterns.png`
```text
PROJECT: Straina, a web app (design the desktop frame first; a phone-width version comes later) for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. Straina is a surveillance and information tool, not a diagnostic or treatment tool.

CONSISTENCY: Reuse the Straina style guide frame "00-style-guide" for every colour, font, type size, spacing step, corner radius and icon. Every screen uses the same header, banners, notices, buttons, fields, cards, loading blocks and toasts described below. Do not add pages, features, buttons, links, filters, charts or copy that are not listed in this prompt.

SHARED COMPONENTS (identical on every screen)
- Header: text wordmark "Straina" at the left (no logo); nav links "Explore" and "About / Data sources"; at the right a "Sign in" button for visitors. A signed-in header shows the role label and a "Sign out" button instead of "Sign in", and is used only where this prompt says so.
- Offline banner (ERR1): full-width strip directly under the header. Text: "You appear to be offline. Please check your connection and try again."
- Demo notice strip (BR13): full-width strip under the header (and under the offline banner if shown) on every screen that displays records. Text, exactly: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Loading: grey placeholder blocks in the shape of the real content, plus the text "Loading…".
- Empty (ERR2): "No data are available for this selection."
- Load error (ERR3): "We couldn't load the latest data. Please try again." with a button "Try again". Unknown error (ERR4): "Something went wrong. Please try again."
- Potential hotspot marking: always the words "Potential hotspot" plus a hatch pattern plus colour. Never colour alone.
- Missing data is never drawn as zero. Areas with no data use a neutral hollow "No data" style, never 0%.

WORDING RULES (apply to every word on screen)
- Say "potential hotspot". Never say "confirmed outbreak", "outbreak", "epidemic", "alert" or "danger".
- No medical advice anywhere: no diagnosis, treatment, dosage or "what you should do" text.
- Demo data is always labelled as demo data on the screen and never described as real.
- Text in [square brackets] is a placeholder. Show it literally in a muted style. Do not invent real place names, organism names, drug names, numbers or dates.

HOW TO OUTPUT: create one frame for the Normal state, then one frame per applicable state listed below, all using the same layout. Title each frame "<screen name> — <state>".


SCREEN: Location detail (S3). Route /areas/:areaCode. Open to everyone. Serves F3, US3, US4 and US5.

LAYOUT (desktop, one centred content column)
1. Header (visitor version), offline banner slot, demo notice strip with the exact BR13 text.
2. Button "Back to map" at the top-left of the content.
3. Page title "[Area name]". Under it, one line: "[Area level] · Area code [Area code]".
4. Row: "Time period: [Period start] – [Period end]".
5. Section "Resistance information": a card with the rows "Pathogen: [Pathogen name]", "Antimicrobial: [Antimicrobial name]", "Isolates tested: [00]", "Isolates resistant: [00]", "Resistance: [00]%".
6. Section "Potential hotspot status": one status label (see the three Normal variants below).
7. Section "Data source and context": "Data source: Straina demo dataset (synthetic)" with the tag "Demo (synthetic)"; rows "Geographic coverage: [Geographic coverage]", "Temporal coverage: [Start date] – [End date]", "Last updated: [Date]"; link "About / Data sources".

STATES
- Normal, three frames that differ only in section 6:
  a) the label "Potential hotspot" with the hatch pattern and colour;
  b) the label "Not a potential hotspot";
  c) the message "There is not enough data to identify a potential hotspot here." (area not flagged; resistance rows still shown).
- Loading: placeholder blocks for sections 3 to 7 and "Loading…". "Back to map" stays visible.
- Empty: no records for the area, or an unknown area code. ERR2 "No data are available for this selection." with the button "Back to map". No zero values are drawn.
- Error: ERR3 with "Try again", and "Back to map".
- Offline: offline banner appears; content stays visible.
- Success: not applicable, because S3 has no save action.
```

---

## Prompt 05 — Potential hotspots — S2 with the hotspot layer ON (F4)

File: `05-potential-hotspots.png`
```text
PROJECT: Straina, a web app (design the desktop frame first; a phone-width version comes later) for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. Straina is a surveillance and information tool, not a diagnostic or treatment tool.

CONSISTENCY: Reuse the Straina style guide frame "00-style-guide" for every colour, font, type size, spacing step, corner radius and icon. Every screen uses the same header, banners, notices, buttons, fields, cards, loading blocks and toasts described below. Do not add pages, features, buttons, links, filters, charts or copy that are not listed in this prompt.

SHARED COMPONENTS (identical on every screen)
- Header: text wordmark "Straina" at the left (no logo); nav links "Explore" and "About / Data sources"; at the right a "Sign in" button for visitors. A signed-in header shows the role label and a "Sign out" button instead of "Sign in", and is used only where this prompt says so.
- Offline banner (ERR1): full-width strip directly under the header. Text: "You appear to be offline. Please check your connection and try again."
- Demo notice strip (BR13): full-width strip under the header (and under the offline banner if shown) on every screen that displays records. Text, exactly: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Loading: grey placeholder blocks in the shape of the real content, plus the text "Loading…".
- Empty (ERR2): "No data are available for this selection."
- Load error (ERR3): "We couldn't load the latest data. Please try again." with a button "Try again". Unknown error (ERR4): "Something went wrong. Please try again."
- Potential hotspot marking: always the words "Potential hotspot" plus a hatch pattern plus colour. Never colour alone.
- Missing data is never drawn as zero. Areas with no data use a neutral hollow "No data" style, never 0%.

WORDING RULES (apply to every word on screen)
- Say "potential hotspot". Never say "confirmed outbreak", "outbreak", "epidemic", "alert" or "danger".
- No medical advice anywhere: no diagnosis, treatment, dosage or "what you should do" text.
- Demo data is always labelled as demo data on the screen and never described as real.
- Text in [square brackets] is a placeholder. Show it literally in a muted style. Do not invent real place names, organism names, drug names, numbers or dates.

HOW TO OUTPUT: create one frame for the Normal state, then one frame per applicable state listed below, all using the same layout. Title each frame "<screen name> — <state>".


SCREEN: Potential hotspots (F4). This is the Map exploration screen (S2, route /explore) with the "Potential hotspots" layer switched ON. Open to everyone. Serves F4, US4 and US5. Use exactly the same layout as "03-explore-time"; only the differences are listed here.

LAYOUT (desktop)
1. Same header, offline banner slot, demo notice strip, left control panel and map as 03-explore-time.
2. The switch "Potential hotspots" is ON.
3. Legend card titled "Legend" now has five entries: "Area with data", "Potential hotspot" (hatch pattern plus colour), "Not a potential hotspot", "Insufficient data", "No data".
4. On the map, draw four to six area markers using those five styles, including two or more "Potential hotspot" areas. Every potential hotspot marker carries the words "Potential hotspot" (not colour alone).
5. One potential hotspot area is selected. A summary card at the bottom of the left column shows: the label "Potential hotspot"; "[Area name]"; "Time period: [Period start] – [Period end]"; "Pathogen: [Pathogen name]"; "Antimicrobial: [Antimicrobial name]"; "Resistance: [00]%"; "Isolates tested: [00]"; "Isolates resistant: [00]"; "Data source: Straina demo dataset (synthetic)" with the tag "Demo (synthetic)"; a link "[Area details]".
6. Under the label in the summary card, one muted line: "[One-line explanation of what a potential hotspot means — copy to be supplied]".

STATES
- Normal: as above.
- Insufficient data: an area with "Insufficient data" styling is selected. The summary card shows the message "There is not enough data to identify a potential hotspot here." and no hotspot label. The area is not flagged.
- Loading: map is a grey placeholder with "Loading…"; dropdowns and the switch are disabled.
- Empty: no records. ERR2 "No data are available for this selection." centred over the map.
- Error: ERR3 with "Try again" centred over the map.
- Offline: offline banner appears; map stays visible.
- Success: not applicable, because there is no save action.
```

---

## Prompt 06 — Data sources — S4, route /about (lower part of the page)

File: `06-data-sources.png`
```text
PROJECT: Straina, a web app (design the desktop frame first; a phone-width version comes later) for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. Straina is a surveillance and information tool, not a diagnostic or treatment tool.

CONSISTENCY: Reuse the Straina style guide frame "00-style-guide" for every colour, font, type size, spacing step, corner radius and icon. Every screen uses the same header, banners, notices, buttons, fields, cards, loading blocks and toasts described below. Do not add pages, features, buttons, links, filters, charts or copy that are not listed in this prompt.

SHARED COMPONENTS (identical on every screen)
- Header: text wordmark "Straina" at the left (no logo); nav links "Explore" and "About / Data sources"; at the right a "Sign in" button for visitors. A signed-in header shows the role label and a "Sign out" button instead of "Sign in", and is used only where this prompt says so.
- Offline banner (ERR1): full-width strip directly under the header. Text: "You appear to be offline. Please check your connection and try again."
- Demo notice strip (BR13): full-width strip under the header (and under the offline banner if shown) on every screen that displays records. Text, exactly: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Loading: grey placeholder blocks in the shape of the real content, plus the text "Loading…".
- Empty (ERR2): "No data are available for this selection."
- Load error (ERR3): "We couldn't load the latest data. Please try again." with a button "Try again". Unknown error (ERR4): "Something went wrong. Please try again."
- Potential hotspot marking: always the words "Potential hotspot" plus a hatch pattern plus colour. Never colour alone.
- Missing data is never drawn as zero. Areas with no data use a neutral hollow "No data" style, never 0%.

WORDING RULES (apply to every word on screen)
- Say "potential hotspot". Never say "confirmed outbreak", "outbreak", "epidemic", "alert" or "danger".
- No medical advice anywhere: no diagnosis, treatment, dosage or "what you should do" text.
- Demo data is always labelled as demo data on the screen and never described as real.
- Text in [square brackets] is a placeholder. Show it literally in a muted style. Do not invent real place names, organism names, drug names, numbers or dates.

HOW TO OUTPUT: create one frame for the Normal state, then one frame per applicable state listed below, all using the same layout. Title each frame "<screen name> — <state>".


SCREEN: Data sources / About (S4), the lower part of the page. Route /about. Open to everyone. Serves F5, US5 and US13. "07-public-explanation" is the upper part of the same page; use the same page frame, header and column width.

LAYOUT (desktop, one centred content column)
1. Header (visitor version), offline banner slot, demo notice strip with the exact BR13 text.
2. Section heading "Data sources". Under it, a list of source cards. Draw one card:
   - name "Straina demo dataset (synthetic)" with the tag "Demo (synthetic)";
   - "Description: [Description]";
   - "Geographic coverage: [Geographic coverage]";
   - "Temporal coverage: [Start date] – [End date]";
   - "Last updated: [Date]";
   - no link row (the demo source has no link).
3. Section heading "Data limitations" with placeholder body text "[Copy to be supplied]".

STATES
- Normal: as above.
- Loading: placeholder blocks for the source list only; the "Data limitations" text and all other static text show at once. Include "Loading…" in the list area.
- Empty: no data sources. ERR2 "No data are available for this selection." in the list area.
- Error: ERR3 with "Try again" in the list area only.
- Offline: offline banner appears; static text stays visible.
- Success: not applicable, because S4 has no save action.
```

---

## Prompt 07 — Public explanation — S4, route /about (upper part of the page, F6)

File: `07-public-explanation.png`
```text
PROJECT: Straina, a web app (design the desktop frame first; a phone-width version comes later) for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. Straina is a surveillance and information tool, not a diagnostic or treatment tool.

CONSISTENCY: Reuse the Straina style guide frame "00-style-guide" for every colour, font, type size, spacing step, corner radius and icon. Every screen uses the same header, banners, notices, buttons, fields, cards, loading blocks and toasts described below. Do not add pages, features, buttons, links, filters, charts or copy that are not listed in this prompt.

SHARED COMPONENTS (identical on every screen)
- Header: text wordmark "Straina" at the left (no logo); nav links "Explore" and "About / Data sources"; at the right a "Sign in" button for visitors. A signed-in header shows the role label and a "Sign out" button instead of "Sign in", and is used only where this prompt says so.
- Offline banner (ERR1): full-width strip directly under the header. Text: "You appear to be offline. Please check your connection and try again."
- Demo notice strip (BR13): full-width strip under the header (and under the offline banner if shown) on every screen that displays records. Text, exactly: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Loading: grey placeholder blocks in the shape of the real content, plus the text "Loading…".
- Empty (ERR2): "No data are available for this selection."
- Load error (ERR3): "We couldn't load the latest data. Please try again." with a button "Try again". Unknown error (ERR4): "Something went wrong. Please try again."
- Potential hotspot marking: always the words "Potential hotspot" plus a hatch pattern plus colour. Never colour alone.
- Missing data is never drawn as zero. Areas with no data use a neutral hollow "No data" style, never 0%.

WORDING RULES (apply to every word on screen)
- Say "potential hotspot". Never say "confirmed outbreak", "outbreak", "epidemic", "alert" or "danger".
- No medical advice anywhere: no diagnosis, treatment, dosage or "what you should do" text.
- Demo data is always labelled as demo data on the screen and never described as real.
- Text in [square brackets] is a placeholder. Show it literally in a muted style. Do not invent real place names, organism names, drug names, numbers or dates.

HOW TO OUTPUT: create one frame for the Normal state, then one frame per applicable state listed below, all using the same layout. Title each frame "<screen name> — <state>".


SCREEN: Public explanation (F6, Should have), the upper part of the About page (S4). Route /about. Open to everyone. Same page frame, header and column width as "06-data-sources"; this is the part above the data sources list.

LAYOUT (desktop, one centred content column; plain language, short blocks, no jargon)
1. Header (visitor version), offline banner slot, demo notice strip with the exact BR13 text.
2. Page title "About / Data sources".
3. Section "What Straina is": placeholder body "[Copy to be supplied]".
4. Section "What antimicrobial resistance means": placeholder body "[Copy to be supplied]".
5. Section "What a potential hotspot means": placeholder body "[Copy to be supplied]".
6. Section "What Straina does not do": body text, exactly: "Straina is a surveillance and information tool, not a diagnostic or treatment tool."
7. Section "About the demo data": placeholder body "[Copy to be supplied: what the demo data is and how it differs from future real surveillance data]", with the tag "Demo (synthetic)".
8. The page continues below into the data sources list shown in 06. Add no extra link or button for that.

STATES
- Normal: as above.
- Offline: offline banner appears; all text stays visible.
- Loading, Empty, Error, Success: not applicable, because this part of S4 is static text that shows at once and has no save action.
```

---

## Prompt 08 — Submit / edit record — S6, routes /records/new and /records/:recordId/edit

File: `08-submit-record.png`
```text
PROJECT: Straina, a web app (design the desktop frame first; a phone-width version comes later) for exploring antimicrobial-resistance (AMR) surveillance information on a map and over time. Straina is a surveillance and information tool, not a diagnostic or treatment tool.

CONSISTENCY: Reuse the Straina style guide frame "00-style-guide" for every colour, font, type size, spacing step, corner radius and icon. Every screen uses the same header, banners, notices, buttons, fields, cards, loading blocks and toasts described below. Do not add pages, features, buttons, links, filters, charts or copy that are not listed in this prompt.

SHARED COMPONENTS (identical on every screen)
- Header: text wordmark "Straina" at the left (no logo); nav links "Explore" and "About / Data sources"; at the right a "Sign in" button for visitors. A signed-in header shows the role label and a "Sign out" button instead of "Sign in", and is used only where this prompt says so.
- Offline banner (ERR1): full-width strip directly under the header. Text: "You appear to be offline. Please check your connection and try again."
- Demo notice strip (BR13): full-width strip under the header (and under the offline banner if shown) on every screen that displays records. Text, exactly: "Demo data — simulated (synthetic) for demonstration. Not real surveillance data."
- Loading: grey placeholder blocks in the shape of the real content, plus the text "Loading…".
- Empty (ERR2): "No data are available for this selection."
- Load error (ERR3): "We couldn't load the latest data. Please try again." with a button "Try again". Unknown error (ERR4): "Something went wrong. Please try again."
- Potential hotspot marking: always the words "Potential hotspot" plus a hatch pattern plus colour. Never colour alone.
- Missing data is never drawn as zero. Areas with no data use a neutral hollow "No data" style, never 0%.

WORDING RULES (apply to every word on screen)
- Say "potential hotspot". Never say "confirmed outbreak", "outbreak", "epidemic", "alert" or "danger".
- No medical advice anywhere: no diagnosis, treatment, dosage or "what you should do" text.
- Demo data is always labelled as demo data on the screen and never described as real.
- Text in [square brackets] is a placeholder. Show it literally in a muted style. Do not invent real place names, organism names, drug names, numbers or dates.

HOW TO OUTPUT: create one frame for the Normal state, then one frame per applicable state listed below, all using the same layout. Title each frame "<screen name> — <state>".


SCREEN: Submit / Edit record (S6). Routes /records/new and /records/:recordId/edit. Open to Admin, and to Data Submitter (edit mode only for records they created). Analysts and visitors are sent elsewhere. Serves F9, US8 and US9.

LAYOUT (desktop, one centred form column)
1. Signed-in header: wordmark "Straina"; links "Explore", "About / Data sources", "Records"; at the right the role label "Data Submitter" and the button "Sign out".
2. Offline banner slot directly under the header.
3. Page title "Submit record" (new mode) or "Edit record" (edit mode).
4. One form card with these fields in this order, each label followed by "(required)":
   Data source (dropdown; shows "Straina demo dataset (synthetic)"), Area code, Area name, Area level (dropdown; options "[Area level options to be decided]"), Latitude, Longitude, Period start (date), Period end (date), Pathogen, Antimicrobial, Isolates tested (whole number), Isolates resistant (whole number).
5. Button row at the bottom: primary "Save", secondary "Cancel".
6. A toast area at the bottom-centre of the screen.

STATES
- Normal: two frames. New mode (all fields empty, title "Submit record") and edit mode (fields show placeholders such as "[Area name]", "[00]"; title "Edit record").
- Loading: edit mode while the record loads: grey placeholder blocks in place of the fields and "Loading…". While saving, "Save" is disabled.
- Empty, two frames:
  a) unknown record: ERR2 "No data are available for this selection." with the button "Back to records";
  b) new mode with no data sources: message "No data sources yet. An Admin must add one first." and "Save" disabled.
- Error, four frames:
  a) required field empty: "This field is required." directly under each empty field; the record is not saved;
  b) "Isolates resistant" larger than "Isolates tested": under "Isolates resistant", "Resistant isolates can't be more than tested isolates.";
  c) save failed: panel above the form, "We couldn't save your changes. Please try again."; the entered values stay in the fields;
  d) not allowed: panel above the form, "You don't have permission to do this."
- Offline: offline banner appears; "Save" is disabled; entered values stay.
- Success: toast "Record saved." (the user is then taken to the Records list, which is not drawn here).
```

---

## Questions (the PRD does not answer these, so I did not guess)

**Design values**
1. **Style guide values.** The PRD leaves all visual values open (Section 18), so the palette, Inter typeface, spacing, radius, shadows and Lucide icons in prompt 00 are my proposal, checked for WCAG AA contrast. Do you confirm them (OQ5)?
2. **F4 and F6 screens.** The PRD has no separate screens for them. I designed F4 as S2 with the hotspot layer on, and F6 as the explanation part of S4. Is that right, or do you want new screens (which would need a PRD change)?
3. **Dark mode and logo.** Dark mode is "not decided" and no logo is mentioned. I used light mode and a text wordmark "Straina".

**Content that does not exist yet**
4. **Demo content.** No area names, area level (OQ6), pathogens, antimicrobials, counts, period format or dates are given (Section 11.5). All sample content is `[placeholder]`.
5. **Copy to be supplied.** The intro text beyond the two PRD sentences on S1, "What Straina is", "What antimicrobial resistance means", "What a potential hotspot means", "About the demo data", "Data limitations", and the one-line explanation in the hotspot card.
6. **Link label to the area page.** The navigation map shows the link S1/S2 to S3 but gives no label. I used `[Area details]`.
7. **Time period control.** The PRD says "select a time period" but not the control type, the period length, or how periods are compared (Flow 2, step 4). I used a dropdown.

**Map behaviour**
8. **How resistance is shown on the map.** The PRD does not say. I used one marker per area at its latitude/longitude, with no colour scale, and showed resistance only on selection.
9. **Map controls and legend.** "Map controls" on S1 are not defined. I assumed zoom in / out only. I derived legend entries from the PRD statuses. Is the hotspot layer also needed on S1, or only on S2?
10. **No area flagged.** What should show when the layer is on and no area meets BR12? No copy exists. Also, hotspot parameter values (OQ2) are undecided, so no thresholds appear on screen.
11. **Zero isolates tested.** BR5 says no percentage is shown. What text replaces it? I did not draw this case.

**Sign-in and form**
12. **Sign-in extras.** Forgot password, create account and default role are undecided (OQ11), so S5 has none of them. Is the map really public (OQ10)? If not, S1 to S4 headers and S5 change.
13. **Form details.** Allowed Area level values (OQ6); how latitude and longitude are entered; message for `period_end` before `period_start` (no ERR copy); whether "Cancel" asks for confirmation; the "(required)" marker is my addition.
14. **Screens not in your list.** S7 Records, S8 Manage users, S9 Manage data sources and S10 Access denied are not in this set. Do you want prompts for them?
