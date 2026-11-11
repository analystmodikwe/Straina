# Team Claude: who does what, after whom, and when

_Straina | Wednesday 11 November 2026_

Each person also has their own page with their steps in detail:

- [Lerato Thungo: Product Owner](lerato-product-owner.md)
- [Lesedi Modikwe: Tech Lead](lesedi-tech-lead.md)
- [Galaletsang Modise: Designer](galaletsang-designer.md)
- [Gareth Motloutsi: QA / Test Lead](gareth-qa-test-lead.md)
- [Thami Sithole: DevOps / Release](thami-devops-release.md)

## 1. The dates that matter

| When | What must be ready | Who is in charge of handing it in |
| --- | --- | --- |
| **Wed 11 Nov, 10:00** (Checkpoint 1) | Repo, protected main, collaborators, README and PRD merged by pull request | Lesedi (done and submitted) |
| **Thu 12 Nov, 10:00** (Checkpoint 2) | Stitch designs in docs/designs/ with the link in the README, implementation plan merged, board with Issues assigned to everyone, CI running | Lesedi submits; each person owns their own piece |
| **Mon 16 Nov, 10:00** (Checkpoint 3) | Log-in working, database live, and one Must feature working on the deployed site | Lesedi and Thami lead; everyone supports |
| **Fri 20 Nov, 10:00** (Final) | Finished app, tests passing, deployed, documentation complete | Thami releases; everyone checks |

## 2. Who we are and what each person owns

Everyone writes code, opens pull requests and reviews pull requests. The role is the thing you also take responsibility for, so that nothing falls between the cracks.

| Person | Role | You are the owner of... | Others come to you for... |
| --- | --- | --- | --- |
| **Lerato Thungo** | Product Owner | The PRD (v1.0 and its change log). Deciding what is in and out of scope. | Questions like: is this a Must or a Should? Does this match the brief? |
| **Lesedi Modikwe** | Tech Lead | Repo, CI, Supabase project, accounts, roles and security rules, the implementation plan. | Technical decisions, unblocking, merge conflicts, access to Supabase. |
| **Galaletsang Modise** | Designer | Stitch designs in docs/designs/ and the design link in the README. Keeping the screens consistent. | What a screen should look like, its states (loading, empty, error). |
| **Gareth Motloutsi** | QA / Test Lead | The test plan, the acceptance criteria on every Issue, and checking that tests are written first. | How to test something, what 'done' means for an Issue. |
| **Thami Sithole** | DevOps / Release | CI, Vercel deployment, environment variables in the hosting dashboard, the final release. | Why the build failed, how to deploy, release checklist. |

## 3. Step by step: who does what, after whom

Read this top to bottom. A step can only start when the one it says it needs is finished. Steps with the same number run **at the same time**, so nobody is idle. Times are suggestions for today and tomorrow, because Checkpoint 2 is at 10:00 on Thursday.

| Step | When | Who | What | Needs first | Done when |
| --- | --- | --- | --- | --- | --- |
| **0** | Wed, now | Everyone | Read README.md and CONTRIBUTING.md. Assign yourself to your Issues. Remember: Issue, branch, PR, review, merge. | Nothing | You can say the workflow in one sentence. |
| **0** | Wed, now | Lesedi | Finish Docker and local Supabase setup (paused for now). Invite the team to the Team Claude organisation in Supabase. | Nothing | Supabase project is in Team Claude and everyone can open it. |
| **1** | Wed afternoon | Everyone. Lerato has the final say on scope, Lesedi on technical choices. | Agree on the open decisions listed in section 6 and write each answer down in one Issue called 'Team decisions'. | Step 0 read | Every decision in section 6 has an answer. |
| **2a** | Wed afternoon and evening | Lerato | Write PRD v1.0 in docs/PRD.md with the decisions, plus a change log. Open a PR. | Step 1 | PRD v1.0 PR is open for review. |
| **2b** | Wed afternoon and evening | Galaletsang | Make the Stitch designs for the main screens: log-in, map, trends, submit record, hotspot view. Save in docs/designs/. Adjust when PRD v1.0 lands. | Step 1 (screens list) | Designs PR is open and the Stitch link is in the README. |
| **2c** | Wed afternoon and evening | Gareth | Draft the test plan outline and a standard acceptance-criteria checklist for every Issue. | Step 1 | Checklist is posted in the team Issue. |
| **2d** | Wed afternoon and evening | Thami | Check that CI is green. Connect the repo to Vercel and deploy the scaffold. Note what environment variables will be needed. | Nothing | A live Vercel link opens the scaffold. |
| **3** | Wed late or Thu early | Reviewers: Lesedi and Gareth for the PRD; Lerato for the designs | Review the PRD and designs PRs. The author merges after one approval and green CI. | Steps 2a and 2b | Both PRs merged to main. |
| **4** | Thu morning, before 10:00 | Lesedi | Write IMPLEMENTATION_PLAN.md from the template, using the merged PRD and designs. Gareth reviews. Lesedi merges. | Step 3 | Plan merged and linked in the README. |
| **4** | Thu morning, before 10:00 | Lesedi, then everyone | Create one Issue for each phase or feature from the plan, with assignee, label and acceptance criteria. Each person checks theirs. | Step 4 plan | Every person has Issues on the Straina Board. |
| **5** | Thu 10:00 | Lesedi | Submit Checkpoint 2 on Discord. | Steps 3 and 4 | Submitted. |
| **6** | Thu to Mon 10:00 | Phase 1: Lesedi and Thami. Others: tests and designs ready for their features | Foundation: log-in, database with security rules, deployed site. Failing tests are written first, then code. | Plan merged | Checkpoint 3 goals live. |
| **7** | Mon to Fri 10:00 | Everyone, by feature phase | Features in the order set by the plan (Must first, then Should), then hardening and release. | Phase 1 | Release checklist ticked by Thami and Gareth. |

> **Honest note about Thursday 10:00.** This is tight. If PRD v1.0 is not ready in time, we submit the merged v0.1 draft, say clearly that v1.0 is in progress, and link the open PR. It is better to hand in something honest than to rush and break main.

## 4. Who is waiting for whom

| Person | Waits for... | Is waited for by... |
| --- | --- | --- |
| **Lerato** | The team decisions in section 6 (Step 1). | Galaletsang (screens list), Lesedi (plan), Gareth (test IDs). |
| **Galaletsang** | The team decisions in section 6; the PRD for the final screen list. | Lesedi (plan needs the designs), everyone building the screens. |
| **Lesedi** | The merged PRD v1.0 and designs. | Everyone, because the Issues on the board come from his plan. |
| **Gareth** | The PRD acceptance criteria. | Everyone, because tests are written before code. |
| **Thami** | Supabase keys, shared privately by Lesedi. | Everyone, because a working live site is part of Checkpoint 3. |

## 5. Who builds which code?

The exact split of the code comes from the **implementation plan**. It lists the phases, the tests and the features in order, and each phase becomes Issues on the board with a name next to it. Until the plan is merged, nobody starts feature code on their own.

What the README already says each person will take on, as a starting point only:

| Person | Planned area (to be confirmed by the plan) |
| --- | --- |
| Lesedi | Repo, CI and scaffold; accounts, roles and row-level security; Supabase |
| Galaletsang | Stitch designs; map view |
| Lerato | PRD; trends view |
| Gareth | Test plan; submit resistance records |
| Thami | CI and deployment; hotspot alerts |

Fair sharing: if one person ends up with much more than the others when the plan is made, we move Issues around in the team chat. Nobody should carry a feature alone because the plan said so.

## 6. Decisions the team needs to make (Step 1)

Nothing below is decided yet. The **Suggested answer** is only a starting point. Agree on each one, write the answer in the last column (or in the 'Team decisions' Issue), and then Lerato puts the answers into PRD v1.0 and adds a row to its change log for each change.

| No. | Decision | What it means in plain words | Suggested answer | Final say | Our answer |
| --- | --- | --- | --- | --- | --- |
| 1 | Do users log in, and what can each type of user do? | Which kinds of user exist, and who can view, add or manage data. | Yes. Log-in through Supabase, with three types: Admin, Data Submitter and Analyst. | Lerato (what each can do), Lesedi (how) | |
| 2 | Where is the data stored? | The database, and the rules that stop a user seeing what they are not allowed to see. | A Supabase database with security rules, so each user only sees what their type allows. | Lesedi | |
| 3 | What data do we show? | Real data is not available to us, so we need a safe replacement. | Made-up (synthetic) demo data, clearly labelled as demo data. No real patient data. | Lerato | |
| 4 | When is a place flagged as a possible hotspot? | One written rule with numbers, so the app does not just guess. | A single rule with numbers, shown as 'potential hotspot', never as 'confirmed outbreak'. | Lerato, with Thami | |
| 5 | Which tool draws the map? | The software that shows the map on the screen. | Leaflet with OpenStreetMap (both free). | Galaletsang, with Lesedi | |
| 6 | Open questions OQ1 to OQ9 in the PRD | Questions the PRD draft leaves unanswered. | Answer each one, or move it to a later version of the app. | Lerato | |

## 7. How we all work, every time

1. **Issue first.** Create it, put your name as assignee, add the label and the board.
2. **Branch from main** with the Issue number, for example `feature/21-map-view`.
3. **Tests first, then code.** Small commits that mention the Issue number, like (#21).
4. **Open a pull request** with `Closes #21`, pick a reviewer, and move your card to In Review.
5. **Reviewers only approve.** They never merge. Only the author merges, after one approval and green CI.
6. **Squash and merge, delete the branch.** The Issue closes and the card moves to Done.

## 8. If you are stuck or confused

Post in the team chat with three things: what you were trying to do, what happened, and what you already tried. Ask early. A 5-minute question on Wednesday saves a lost day on Friday. If you are waiting for someone for more than half a day, tell Lesedi so the work can be re-arranged.
