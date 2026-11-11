# Lesedi Modikwe: Tech Lead

_Your part of Straina: keeping the build on track, the technical decisions, and the implementation plan_

[Back to the team page](README.md)

## Your job in plain words

You set up the foundations (repo, CI, protected main) and now you lead the build. Your main deliverable is the **implementation plan**, which turns the PRD and the designs into phases, tests and Issues that everyone can follow. You also own the Supabase project, accounts, roles and the database security rules, and you unblock the team when someone is stuck.

## What you own

- **IMPLEMENTATION_PLAN.md** and the Issues on the Straina Board that come from it.
- The **Supabase project** in the Team Claude organisation: tables, accounts, roles and security rules (migration files merged through PRs).
- Who gets which keys. The anon (public) key goes to the team privately; the service role key and database password stay with you only.
- Handing in Checkpoints 2 and 3 and the final submission on Discord.

## Your steps, in order

Times are suggestions for today and tomorrow. Checkpoint 2 is Thursday 12 November at 10:00.

| Step | When | What you do | You need first | Done when |
| --- | --- | --- | --- | --- |
| 0 | Wed, now | Housekeeping first: disconnect the GitHub integration in Supabase, transfer the Straina project to Team Claude, then invite the team to that organisation only. Then send the project URL and anon key privately. | Nothing | The team can open the project; Thami has the keys for Vercel. |
| 0 | Wed, now | Create the Issues for the document tasks, create the 'Team decisions' Issue, and share the roles PDFs. Resume Docker and local Supabase after this. | Nothing | Everyone has Issues with their name on them. |
| 1 | Wed afternoon | Take part in the team decisions. You have the final say on technical choices: Supabase, database security rules and how accounts work. | Everyone has read the README and CONTRIBUTING | Answers are written in the 'Team decisions' Issue. |
| 3 | Wed late or Thu early | Review Lerato's PRD v1.0 PR for technical feasibility. You only approve; Lerato merges her own PR. | Her PR is open | You approved or asked for changes. |
| 4 | Thu morning, before 10:00 | Write IMPLEMENTATION_PLAN.md from the template, using the merged PRD v1.0 and the designs. Open a PR; Gareth reviews; you merge. | PRD v1.0 and designs merged | Plan is on main and linked in the README. |
| 4 | Thu morning, before 10:00 | Create one Issue per phase or feature from the plan, each with an assignee, a label and acceptance criteria. Ask each person to check theirs. | The plan | Everyone has Issues on the Straina Board. |
| 5 | Thu 10:00 | Submit Checkpoint 2 on Discord: designs and the Stitch link in the README, plan merged, board Issues for everyone, CI running. | Steps 3 and 4 | Submitted. |
| 6 | Thu to Mon 10:00 | Phase 1 (Foundation): log-in, the database through migration files, and the security rules, with Thami deploying the live site. This is Checkpoint 3. | The plan | Log-in, database and one Must feature work on the live site. |
| 7 | Mon to Fri 10:00 | Unblock people, help with merge conflicts, check that phases follow the plan, and hand in the final submission with Thami and Gareth. | Features merged | Final submission handed in. |

## How to write the implementation plan

1. **Gather first:** the merged PRD v1.0, the designs in docs/designs/ and the IMPLEMENTATION_PLAN template. Do not start from an old PRD.
2. **Follow the template exactly:** same sections, same order, same table columns. Copy the rules for the coding agent word for word and leave no placeholders.
3. **Use the PRD's own IDs** (F1 to F7 and the rest). Never rename or renumber them. Anything the PRD lists as a non-goal or a later feature goes in the Deferred list and is not planned.
4. **Phase order:** Foundation, then Data and security, then feature phases (Must before Should, one or two features each), then Hardening, then Release.
5. **Every phase has the same five steps:** failing tests first, backend, frontend, refactor and full check, manual checks. Each test has an ID that points to a PRD ID, one test per row.
6. **Cover the whole stack:** folder structure, environment variables, commands, database tables and security rules, log-in, and deployment. No secrets in the plan or in the repo.
7. **Match the designs:** for each screen, its route, who can open it, its states and the PRD stories it serves. Say where the designs and the PRD disagree and which one wins.
8. **Never guess:** if something is unclear, put it in the Clarifications section with a proposed answer and mark it Open. Do not decide silently.
9. **Check before you merge:** every section is present, every PRD ID has a test, and nothing is blank.

How to open the PR (use the Issue number instead of 17):

```bash
git checkout main
git pull
git checkout -b docs/17-implementation-plan
# (do your work, then)
git add .
git commit -m "docs: add implementation plan (#17)"
git push -u origin docs/17-implementation-plan
```

## Who waits for you, and who you wait for

- **Waiting for you:** everyone. The plan gives them their Issues, and your Supabase work gives them the keys and the database.
- **You wait for:** Lerato's merged PRD v1.0 and Galaletsang's merged designs, then Gareth's review of the plan.

## Before you hand in

- [ ] Every section of the plan is filled in and every PRD ID has a test.
- [ ] The plan is linked in the README, and the README has the Stitch link.
- [ ] Every teammate has Issues with an assignee, a label and the Straina Board.
- [ ] CI on main is green.
- [ ] The Supabase keys were shared privately, and no secret is in the repo.
- [ ] Checkpoint 2 is submitted before 10:00.

## After Thursday

You build your planned area (accounts, roles and security rules, Supabase). You also watch the board: if anyone is blocked for more than half a day, re-arrange the work. Keep enforcing the rules that make the repo safe: no direct pushes to main, one approval, green CI, and only the author merges.

> **If you are stuck:** post in the team chat what you tried and what happened, and ask a teammate to look with you. Ask early, because the whole team waits on your plan.
