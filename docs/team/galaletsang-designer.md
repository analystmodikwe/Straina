# Galaletsang Modise: Designer

_Your part of Straina: how every screen looks, so the plan and the code have something to follow_

[Back to the team page](README.md)

## Your job in plain words

The Stitch designs show the team what we are building before we build it. The implementation plan lists every screen from your designs, and the front-end code copies them. Your job is to design each screen, with all its states, save the files in the repo, and put the Stitch link in the README.

## What you own

- **docs/designs/** and the Stitch link in the README (the 'Stitch designs' row currently says 'To be added').
- Keeping colours, fonts and spacing the same on every screen.
- Making sure each screen shows every state it needs.

## Your steps, in order

Times are suggestions for today and tomorrow. Checkpoint 2 is Thursday 12 November at 10:00.

| Step | When | What you do | You need first | Done when |
| --- | --- | --- | --- | --- |
| 1 | Wed afternoon | Take part in the team decisions. You have a say on the map tool together with Lesedi. Write down your list of screens. | Everyone has read the README and CONTRIBUTING | Your screen list is posted in the team chat. |
| 2b | Wed afternoon and evening | Design the screens in Stitch (list below). Export them and save in docs/designs/. Add the Stitch link to the README. Open a pull request. | Step 1 (decisions) | The PR is open and the link is in the README. |
| 3 | Wed late or Thu early | When PRD v1.0 is merged, check each screen against it and adjust. Lerato reviews. When approved and CI is green, **you** merge. | PRD v1.0, one approval | Designs are on main. |

## What to design and how to save it

1. **Screens:** log-in; the map (F1); exploring time (F2); resistance patterns (F3); potential hotspots (F4); where the data comes from (F5); the public explanation (F6, Should); and the form to submit a resistance record.
2. **States:** for each screen, show how it looks when it is normal, loading, empty, in error, offline and after success. Not every screen needs every state, but say which ones apply.
3. **Wording rules:** a place is a 'potential hotspot', never a 'confirmed outbreak'. Demo data is labelled as demo data on the screen. No medical advice anywhere.
4. **Files:** name them in order, like `01-login.png` and `02-map.png`. Add a short `docs/designs/README.md` with one line per screen: its name, who can open it, and the PRD ID it serves.
5. **Style guide:** a short note with the colours, fonts and spacing you used, so the code can match.

How to open the PR (use the Issue number instead of 16):

```bash
git checkout main
git pull
git checkout -b docs/16-stitch-designs
# (do your work, then)
git add .
git commit -m "docs: add Stitch designs and link in README (#16)"
git push -u origin docs/16-stitch-designs
```

## Who waits for you, and who you wait for

- **Waiting for you:** Lesedi (the plan lists your screens), and everyone building the front end.
- **You wait for:** the team decisions, and PRD v1.0 for the final screen list. If v1.0 is late, design from v0.1 and adjust afterwards.

## Before you hand in

- [ ] Every screen in your list has a file in docs/designs/.
- [ ] Each screen shows its states.
- [ ] The Stitch link in the README opens for the whole team.
- [ ] docs/designs/README.md lists every screen.
- [ ] The PR has `Closes #` and your Issue number, the label design and the Straina Board.

## After Thursday

Adjust designs when the PRD changes. During the build phases you build your planned area (the map view, to be confirmed by the implementation plan) and check that other people's screens match your designs when you review their PRs.

> **If you are stuck:** post in the team chat what you were trying to do, what happened, and what you already tried. Ask early. If you are waiting on someone for more than half a day, tell Lesedi so the work can be re-arranged.
