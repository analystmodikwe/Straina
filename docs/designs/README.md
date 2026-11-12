# Straina designs

Stitch designs for Straina. Each screen has one main image (`NN-name.png`, Normal state) and state images named `NN-name--state.png` (loading, empty, error, offline, success, where they apply). Colours, fonts and spacing are in [`style-guide.md`](./style-guide.md) (Proposed; Galaletsang confirms, OQ5). The Stitch prompts are in [`stitch-prompts.md`](./stitch-prompts.md).

- `00-style-guide.png` — Style guide (matches `style-guide.md`) — everyone (design reference, not a screen) — PRD Section 18, OQ5
- `01-login.png` — Sign in (S5, `/sign-in`) — visitors only; a signed-in user is sent to S1 — F8, US6
- `02-map.png` — Map (S1, `/`) — everyone — F1, US1, US5, US13
- `03-explore-time.png` — Exploring time (S2, `/explore`) — everyone — F2, US2, US3
- `04-resistance-patterns.png` — Resistance patterns (S3, `/areas/:areaCode`) — everyone — F3, US3, US4, US5
- `05-potential-hotspots.png` — Potential hotspots (S2, `/explore`, hotspot layer on) — everyone — F4, US4
- `06-data-sources.png` — Data sources (S4, `/about`, lower part) — everyone — F5, US5, US13
- `07-public-explanation.png` — Public explanation (S4, `/about`, upper part) — everyone — F6
- `08-submit-record.png` — Submit / edit record (S6, `/records/new`, `/records/:recordId/edit`) — Admin; Data Submitter (edit only records they created) — F9, US8, US9
