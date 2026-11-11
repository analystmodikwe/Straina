# Thami Sithole: DevOps / Release

_Your part of Straina: making sure what we build runs, ships and stays safe_

[Back to the team page](README.md)

## Your job in plain words

You look after the automatic checks (CI), the live website on Vercel, and the secret keys. At each checkpoint the team needs a working link, so you make sure every merge to main builds and goes live. In the last week you run the release.

## What you own

- **CI**: the GitHub Actions workflow that runs lint, type check, tests and build on every pull request.
- The **Vercel project** and the environment variables in the Vercel dashboard.
- Keeping secrets out of the repo.
- The release checklist and the final release.

## Your steps, in order

Times are suggestions for today and tomorrow. Checkpoint 2 is Thursday 12 November at 10:00.

| Step | When | What you do | You need first | Done when |
| --- | --- | --- | --- | --- |
| 1 | Wed afternoon | Take part in the team decisions. You have a say on the hotspot rule together with Lerato. | Everyone has read the README and CONTRIBUTING | The decisions are clear. |
| 2d | Wed afternoon and evening | Check that CI is green on main. Make sure the scaffold is deployed on Vercel and share the live link in the team chat. List the environment variables we will need. | Nothing | A live link opens the scaffold. |
| 6 | Thu to Mon | With Lesedi, add the Supabase settings to Vercel and make sure each merge to main redeploys. This is part of Checkpoint 3. | Supabase URL and public key, sent privately by Lesedi | The live site shows log-in and the database working. |
| 7 | Mon to Fri | Release: run the release checklist with Gareth, then confirm the final deployment before Friday 10:00. | All features merged | The checklist is fully ticked. |

## How to do the deployment safely

1. **CI:** open the repo's Actions tab. The latest run on main should be green. If it is red, open it, read the failing step, and tell the author.
2. **Vercel:** Lesedi has already started a Vercel project. Ask him before creating a second one, and agree who owns it. Vercel's free plan limits who can deploy from someone else's repository, so if you hit a block, tell Lesedi. The project name must be lowercase with hyphens, such as `straina`.
3. **Settings:** Vite project, build command `npm run build`, output folder `dist`.
4. **Environment variables:** add them in the Vercel dashboard, never in the code. They are likely a Supabase URL and the public (anon) key; the exact names come from the implementation plan.
5. **The service role key stays private.** Never put it in Vercel's front-end settings, in the repo, or in the chat.
6. **.env.example:** list the variable names with fake values so teammates know what to create locally. Never commit a real `.env`.

## Who waits for you, and who you wait for

- **Waiting for you:** everyone, because a working live link is part of Checkpoint 3 and the final submission.
- **You wait for:** Lesedi, who shares the Supabase URL and public key privately once the project in Team Claude is ready.

## Before you hand in

- [ ] CI on main is green.
- [ ] The live link opens and is shared in the team chat.
- [ ] Every environment variable is set in Vercel and listed (names only) in .env.example.
- [ ] No secret appears anywhere in the repo.
- [ ] Your name is on your Issues as assignee, with the label devops and the Straina Board.

## After Thursday

Each phase, you check that every merge to main redeploys and that CI stays green. You build your planned area (hotspot alerts, to be confirmed by the implementation plan). In the final week you own the release checklist with Gareth: the live link works, the README is accurate, known issues are listed, and nothing secret is public.

> **If you are stuck:** post in the team chat what you were trying to do, what happened, and what you already tried. Ask early. If you are waiting on someone for more than half a day, tell Lesedi so the work can be re-arranged.
