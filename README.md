# Straina

**Straina is an antimicrobial-resistance (AMR) mapping platform that shows where drug-resistant organisms are emerging, how resistance patterns change over time, and which areas may become hotspots, so health teams can act earlier.**

> Straina is a surveillance and information tool. It is not a diagnostic or treatment tool. The demo uses simulated (synthetic) data, which is labelled as such in the app.

## The problem

Antimicrobial resistance is a major public-health concern, but the information is often spread across disconnected reports, datasets and dashboards that are hard to read. Straina presents AMR information on an interactive map with a time-based view, so people can see where resistance is observed, how it changes, and where closer attention may be needed.

## Links

| What | Link |
| --- | --- |
| Live app | To be added |
| Stitch designs | To be added |
| Project board | https://github.com/users/analystmodikwe/projects/8 |
| Team Loom | To be added |
| PRD | [docs/PRD.md](docs/PRD.md) |
| Designs | [docs/designs/](docs/designs/) |
| Implementation plan | [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) (to be added) |

## Team & Roles

**Team Claude** (SNPL April Cohort 2026)

| Name | GitHub | Role(s) | Main features built |
| --- | --- | --- | --- |
| Lerato Thungo | [LeratoDaisy](https://github.com/LeratoDaisy) | Product Owner, Frontend, Backend | PRD; trends view (planned) |
| Lesedi Modikwe | [analystmodikwe](https://github.com/analystmodikwe) | Tech Lead, Frontend, Backend | Repo, CI and scaffold; accounts, roles and RLS; Supabase (planned) |
| Galaletsang Modise | [galaletsangmodise](https://github.com/galaletsangmodise) | Designer, Frontend, Backend | Stitch designs; map view (planned) |
| Gareth Motloutsi | [GarethMalekaMotloutsi](https://github.com/GarethMalekaMotloutsi) | QA / Test Lead, Frontend, Backend | Test plan; submit resistance records (planned) |
| Thami Sithole | [ThamiRoneo](https://github.com/ThamiRoneo) | DevOps / Release, Frontend, Backend | CI/deployment; hotspot alerts (planned) |

Everyone writes code, opens PRs and reviews PRs. The "Main features built" column is updated as features are merged.

## Features

| Priority | Feature | Status |
| --- | --- | --- |
| Must | F1 Interactive AMR map | 🚧 planned |
| Must | F2 Time exploration | 🚧 planned |
| Must | F3 Resistance pattern exploration | 🚧 planned |
| Must | F4 Potential hotspot identification | 🚧 planned |
| Must | F5 Data source context | 🚧 planned |
| Should | F6 Public explanation layer | 🚧 planned |
| Should | F7 Advanced analysis | 🚧 planned |

✅ done · 🚧 in progress or planned. The final feature list follows PRD v1.0 and may change, and every change is recorded in the PRD change log.

## Tech stack and architecture

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS (planned) |
| Map | Leaflet with OpenStreetMap (planned) |
| Backend, database and auth | Supabase: Postgres, Auth, Row-Level Security (planned) |
| Testing | Vitest (plus component and end-to-end tests, planned) |
| CI | GitHub Actions |
| Hosting | Vercel (planned) |

```
User -> React web app (Vite) -> Supabase (Auth + Postgres with RLS) -> AMR data
```

The frontend talks to Supabase through the `supabase-js` client. Permissions are enforced in the database with Row-Level Security, not only in the screens.

## Run it locally

**Prerequisites:** Node.js 22 or newer (`node -v`), npm, Git.

```bash
git clone https://github.com/analystmodikwe/Straina.git
cd Straina
npm install
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

**Environment variables:** copy `.env.example` to `.env` and fill in the values. `.env.example` will be added with the first Supabase PR. Real keys are shared privately and `.env` is never committed.

**Database migrations and seed data:** to be added when the Supabase setup is merged.

## Test logins

Test accounts only, never real passwords. To be added when sign-in is built (one account for each role).

## Tests

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

These four checks also run automatically on every pull request (GitHub Actions). What the tests cover will be listed here as they are written.

## Deployment

Planned: the frontend on Vercel, connected to this repo so every merge to `main` redeploys. The database and auth run on a hosted Supabase project, and environment variables are set in the hosting dashboard, never in the repo.

## Known issues and next steps

- Features are still being built (see the board).
- The data is simulated; connecting a real authoritative data source is a future step.
- Ideas for later: more advanced analysis, CSV import, and a view of areas near a hotspot.

## How we work

- **`main` is protected.** No direct pushes. Every change goes through a pull request with at least 1 approval and a passing CI check.
- **Branches:** `feature/12-short-name`, `fix/15-short-name`, `chore/3-short-name` and `docs/2-short-name`, where the number is the Issue number.
- **Commits:** small and clear, like `feat: add record form (#12)`.
- **Pull requests:** describe what changed and why, include `Closes #12`, screenshots and how it was tested. Ask for a teammate as reviewer.
- **Reviews:** a teammate reads the code and approves or requests changes. Nobody approves or merges their own work without a review.
- **Merging:** squash and merge once approved and CI is green, then delete the branch.
- **Tasks:** every feature or phase is an Issue with acceptance criteria, an assignee and a label, tracked on the [project board](https://github.com/users/analystmodikwe/projects/8).
- **Secrets:** never commit `.env`. Only `.env.example` is committed.
