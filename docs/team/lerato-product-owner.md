# Lerato Thungo: Product Owner

_Your part of Straina: what the app is supposed to do, written down so everyone can build from it_

[Back to the team page](README.md)

## Your job in plain words

Everything else in the project is built from the PRD: the designs, the implementation plan, the tests and the code. You wrote the first draft (v0.1). Your job now is to turn it into **PRD v1.0** using the team's decisions, and then to keep it accurate. You also decide what is in scope (Must) and what can wait (Should).

## What you own

- **docs/PRD.md** and its change log.
- Deciding what is a Must and what is a Should, and what we will not build.
- Answering 'is this in scope?' questions from the team.
- Saying at the end whether each feature does what the PRD promised.

## Your steps, in order

Times are suggestions for today and tomorrow. Checkpoint 2 is Thursday 12 November at 10:00.

| Step | When | What you do | You need first | Done when |
| --- | --- | --- | --- | --- |
| 1 | Wed afternoon | Take part in the team decisions (section 6 of the main page). You have the final say on log-in and roles, the kind of data, the hotspot rule and the open questions. | Everyone has read the README and CONTRIBUTING | Answers are written in the 'Team decisions' Issue. |
| 2a | Wed afternoon and evening | Write PRD v1.0 in docs/PRD.md (the checklist is below). Open a pull request. Ask Lesedi and Gareth to review. | Step 1 | The PR is open and linked to your Issue. |
| 3 | Wed late or Thu early | Answer review comments and fix them. When you have one approval and a green CI check, **you** click Squash and merge. | Approval from a reviewer | PRD v1.0 is on main. |
| 3 | Wed late or Thu early | Review Galaletsang's designs PR: does every screen match the PRD? | Her PR is open | You have approved or asked for changes. |

## How to write PRD v1.0 (everything it must contain)

1. **Accounts and roles:** who is an Admin, a Data Submitter and an Analyst, and a small table of what each one can and cannot do.
2. **The data:** the fields a resistance record holds (list the real ones you decide on), and the decision that the data is synthetic and clearly labelled as demo data.
3. **The hotspot rule:** one clear rule with numbers. Wording is 'potential hotspot', never 'confirmed outbreak', and the app gives no medical advice.
4. **The map tool:** Leaflet with OpenStreetMap, if the team agrees.
5. **Non-goals, edge cases and screens:** what we will not build; the odd situations (empty data, no internet, wrong role) each with a test ID; a navigation map; and the states each screen needs (normal, loading, empty, error, success).
6. **Open questions OQ1 to OQ9:** answer every one, or move it to a later version.
7. **Change log:** one row for every change from v0.1, saying what changed and why. Never rename or renumber existing IDs such as F1 to F7.

How to open the PR (use the Issue number instead of 15):

```bash
git checkout main
git pull
git checkout -b docs/15-prd-v1
# (do your work, then)
git add .
git commit -m "docs: PRD v1.0 with team decisions (#15)"
git push -u origin docs/15-prd-v1
```

## Who waits for you, and who you wait for

- **Waiting for you:** Galaletsang (the list of screens), Lesedi (the implementation plan) and Gareth (acceptance criteria for the tests).
- **You wait for:** the team decisions in step 1. Without them v1.0 cannot be finished.

## Before you hand in

- [ ] Every item in the list above is in docs/PRD.md.
- [ ] The change log has a row for each change.
- [ ] No placeholder text or TBD is left, except questions clearly marked as moved to later.
- [ ] The PR says `Closes #` and your Issue number, and has the label docs and the Straina Board.
- [ ] Your name is on the Issue as assignee.

## After Thursday

Keep the PRD up to date. If the team changes a requirement, change the PRD first and add a change log row. During the build phases you also build your planned area (the trends view, to be confirmed by the implementation plan) and, at the end, check each feature against the PRD.

> **If you are stuck:** post in the team chat what you were trying to do, what happened, and what you already tried. Ask early. If you are waiting on someone for more than half a day, tell Lesedi so the work can be re-arranged.
