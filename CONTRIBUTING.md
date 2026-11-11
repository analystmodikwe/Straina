# Contributing to Straina

Our mentors mark the board, Issues, PRs and reviews, so every piece of work follows this order:

**Issue ➜ Branch ➜ PR ➜ Review ➜ Merge**

## 1. Create the Issue first
Issues tab → New issue.
- **Title:** what you will do, for example `feat: add resistance record form`
- **Description:** a short checklist of **acceptance criteria**
- On the right-hand side set:
  - **Assignees:** yourself
  - **Labels:** one or more (`feature`, `docs`, `backend`, `frontend`, `testing`, `devops`, `design`, `chore`)
  - **Projects:** `Straina Board`
- Note the Issue number, for example `#12`.

## 2. Create a branch (never work on `main`)
```bash
git checkout main
git pull
git checkout -b feature/12-short-name
```
Branch names: `feature/`, `fix/`, `chore/`, `docs/` followed by the Issue number and a short name.

## 3. Build it, tests first
Write the failing tests, then the code, then run:
```bash
npm run lint
npm run typecheck
npm test
npm run build
```
Make small, clear commits with the Issue number:
```bash
git commit -m "feat: add record form (#12)"
git push -u origin feature/12-short-name
```

## 4. Open the pull request
Describe what changed and why, how you tested it, add screenshots, and write `Closes #12`. On the right-hand side set:
- **Assignees:** yourself
- **Reviewers:** one teammate
- **Labels:** the same as the Issue
- **Projects:** `Straina Board`

The PR template fills in the description for you.

## 5. Review and merge
- The reviewer reads the code and clicks **Approve** (or requests changes).
- Never approve or merge your own work without a review.
- When it is approved and CI is green: **Squash and merge**, then **Delete branch**.
- The Issue closes by itself and the card moves to **Done**.

## The board
Repo → Projects → `Straina Board`: https://github.com/users/analystmodikwe/projects/8

Columns: Backlog → To Do → In Progress → In Review → Done. Move your card to **In Progress** when you start and **In Review** when you open the PR.

## Rules
- No direct pushes to `main`. `main` needs a PR, 1 approval and passing CI.
- No giant PRs. Keep PRs small and focused on one Issue.
- Set your Git identity to your GitHub email so your commits count as yours:
  `git config --global user.email "you@example.com"`
- Never commit `.env`. Only `.env.example` is committed. Share real keys privately.
- Every Issue and PR must have **your name as assignee**.
- Post a daily update in the team thread: what I did, what is next, what is blocking me.
- If your PR clashes with someone else's work, pull `main`, resolve the conflict, and check the result before pushing.