# Gareth Motloutsi: QA / Test Lead

_Your part of Straina: making sure the app really works and that 'done' means done_

[Back to the team page](README.md)

## Your job in plain words

Our rule is that tests are written before the code. You guard that rule. You decide how we test, you write the checklist that every Issue must meet, and you check that each requirement in the PRD has a test. You also review pull requests with a tester's eye.

## What you own

- **docs/TEST_PLAN.md**: how we test and what the test IDs look like.
- The acceptance-criteria checklist used on every Issue.
- Linking every test back to a PRD ID (such as F1) so nothing is forgotten.
- The release checks together with Thami.

## Your steps, in order

Times are suggestions for today and tomorrow. Checkpoint 2 is Thursday 12 November at 10:00.

| Step | When | What you do | You need first | Done when |
| --- | --- | --- | --- | --- |
| 1 | Wed afternoon | Take part in the team decisions. Ask for numbers wherever a rule needs to be tested, such as the hotspot rule. | Everyone has read the README and CONTRIBUTING | The rules you must test are clear. |
| 2c | Wed afternoon and evening | Write the test plan and the standard acceptance checklist. Open a pull request with docs/TEST_PLAN.md. | Step 1 | The PR is open and the checklist is in the team chat. |
| 3 | Wed late or Thu early | Review Lerato's PRD v1.0 PR: can every requirement be tested? | Her PR is open | You approved or asked for changes. |
| 4 | Thu morning | Review Lesedi's implementation plan PR: does every PRD ID have a test in the plan? | His plan PR is open | You approved or asked for changes. |

## What goes in the test plan

1. **Kinds of tests:** unit tests (we already have Vitest in the repo, run with `npm test`), end-to-end tests of full user journeys, and manual checks done by a person.
2. **Test IDs:** every test gets an ID that points to a PRD ID, for example `T-F1-01` for the first test of F1. One test per row, never several squeezed together.
3. **Tests first:** before code is written, the test exists and fails. A phase is not finished until it passes.
4. **Permission tests:** for each rule, one test that shows the allowed user can do it and one that shows the wrong user cannot.
5. **Acceptance checklist for any Issue:** clear steps to try, the expected result, the PRD ID it serves, and who checked it.

**Your review checklist for every pull request:** the Issue is linked; the tests exist and failed first; CI is green; no .env or secrets are included; screenshots are attached for screens; demo data is labelled.

## Who waits for you, and who you wait for

- **Waiting for you:** everyone, because tests come before code and the acceptance checklist goes on every Issue.
- **You wait for:** the PRD acceptance criteria and the numbers in the hotspot rule.

## Before you hand in

- [ ] docs/TEST_PLAN.md explains the kinds of tests, the ID format and the tests-first rule.
- [ ] The acceptance checklist is posted where the whole team can use it.
- [ ] The PR has `Closes #` and your Issue number, the label test and the Straina Board.
- [ ] Your name is on the Issue as assignee.

## After Thursday

At the start of every phase you check that the failing tests exist. You review pull requests, and you build your planned area (submitting resistance records, to be confirmed by the implementation plan). In the last week you run the release checks with Thami.

> **If you are stuck:** post in the team chat what you were trying to do, what happened, and what you already tried. Ask early. If you are waiting on someone for more than half a day, tell Lesedi so the work can be re-arranged.
