# Code Structure & File Ownership

> **Purpose:** Every team member works in their own files to prevent merge conflicts.
> Each file is owned by exactly one person. If you need to touch someone else's file,
> open a PR and tag the owner for review first.

## Repository Layout

```
Straina/
├── .github/
│   └── workflows/
│       └── ci.yml                    ← Thami
├── docs/
│   ├── PRD.md                        ← Lerato
│   ├── designs/                      ← Galaletsang
│   ├── team/
│   │   └── README.md                 ← Lesedi (team overview)
│   └── code-structure/               ← Lesedi (this folder)
├── supabase/
│   └── migrations/                   ← Lesedi
├── src/
│   ├── App.tsx                       ← Lesedi (routing shell)
│   ├── main.tsx                      ← Lesedi
│   ├── index.css                     ← Galaletsang
│   ├── theme/
│   │   └── tokens.ts                 ← Galaletsang
│   ├── types/
│   │   └── index.ts                  ← Lesedi
│   ├── lib/
│   │   ├── supabase.ts               ← Lesedi
│   │   ├── messages.ts               ← Lesedi
│   │   ├── validation.ts             ← Gareth
│   │   └── hotspot.ts                ← Thami
│   ├── hooks/
│   │   └── useOnline.ts              ← Thami
│   ├── api/
│   │   ├── auth.ts                   ← Lesedi  (OP1 signIn, OP2 signOut, OP3 getSession)
│   │   ├── observations.ts           ← Gareth  (OP4 query, OP7 create, OP8 update, OP9 delete)
│   │   ├── sources.ts                ← Lerato  (OP6 getDataSources)
│   │   └── users.ts                  ← Thami   (OP10 getUsers, OP11 updateRole)
│   ├── pages/
│   │   ├── S1_HomeMap.tsx            ← Galaletsang
│   │   ├── S2_Explore.tsx            ← Galaletsang
│   │   ├── S3_AreaDetail.tsx         ← Lerato
│   │   ├── S4_About.tsx              ← Lerato
│   │   ├── S5_SignIn.tsx             ← Lesedi
│   │   ├── S6_RecordForm.tsx         ← Gareth
│   │   ├── S7_RecordList.tsx         ← Gareth
│   │   ├── S8_ManageUsers.tsx        ← Thami
│   │   ├── S9_ManageSources.tsx      ← Thami
│   │   └── S10_AccessDenied.tsx      ← Lesedi
│   └── components/
│       ├── Header.tsx                ← Lesedi
│       ├── ProtectedRoute.tsx        ← Lesedi
│       ├── Toast.tsx                 ← Lesedi
│       ├── ErrorPanel.tsx            ← Gareth
│       ├── DeleteConfirmModal.tsx    ← Gareth
│       ├── RecordRow.tsx             ← Gareth
│       ├── DemoNotice.tsx            ← Galaletsang
│       ├── MapLegend.tsx             ← Galaletsang
│       ├── AboutSection.tsx          ← Lerato
│       ├── PatternCard.tsx           ← Lerato
│       ├── OfflineBanner.tsx         ← Thami
│       └── UI/
│           ├── Button.tsx            ← Galaletsang
│           ├── TextField.tsx         ← Gareth
│           ├── SelectField.tsx       ← Gareth
│           └── Modal.tsx             ← Gareth
└── tests/
    ├── unit/
    │   ├── security.test.ts          ← Lesedi
    │   ├── tokens.test.ts            ← Galaletsang
    │   ├── validation.test.ts        ← Gareth
    │   └── hotspot.test.ts           ← Thami
    ├── components/
    │   ├── Header.test.tsx           ← Lesedi
    │   ├── SignIn.test.tsx            ← Lesedi
    │   ├── ProtectedRoute.test.tsx   ← Lesedi
    │   ├── MapView.test.tsx          ← Galaletsang
    │   ├── ExploreTime.test.tsx      ← Galaletsang
    │   ├── AreaDetail.test.tsx       ← Lerato
    │   ├── About.test.tsx            ← Lerato
    │   ├── RecordForm.test.tsx       ← Gareth
    │   ├── RecordList.test.tsx       ← Gareth
    │   ├── ManageUsers.test.tsx      ← Thami
    │   ├── ManageSources.test.tsx    ← Thami
    │   └── Offline.test.tsx          ← Thami
    └── integration/
        ├── schema.test.ts            ← Lesedi
        └── rls.test.ts               ← Gareth
```

---

## Ownership Matrix

| Member | Frontend Files | Backend Files | Test Files |
|---|---|---|---|
| **Lesedi** (Tech Lead) | `S5_SignIn.tsx`, `S10_AccessDenied.tsx`, `Header.tsx`, `ProtectedRoute.tsx`, `Toast.tsx`, `App.tsx` | `src/lib/supabase.ts`, `src/api/auth.ts`, `src/types/index.ts`, `src/lib/messages.ts`, `supabase/migrations/` | `tests/unit/security.test.ts`, `tests/components/Header.test.tsx`, `tests/components/SignIn.test.tsx`, `tests/components/ProtectedRoute.test.tsx`, `tests/integration/schema.test.ts` |
| **Lerato** (Product Owner) | `S3_AreaDetail.tsx`, `S4_About.tsx`, `AboutSection.tsx`, `PatternCard.tsx` | `src/api/sources.ts` | `tests/components/AreaDetail.test.tsx`, `tests/components/About.test.tsx` |
| **Galaletsang** (Designer) | `S1_HomeMap.tsx`, `S2_Explore.tsx`, `MapLegend.tsx`, `DemoNotice.tsx`, `UI/Button.tsx`, `src/theme/tokens.ts`, `tailwind.config.js`, `src/index.css` | *(contributes to map data assertions in tests)* | `tests/unit/tokens.test.ts`, `tests/components/MapView.test.tsx`, `tests/components/ExploreTime.test.tsx` |
| **Gareth** (QA/Test Lead) | `S6_RecordForm.tsx`, `S7_RecordList.tsx`, `ErrorPanel.tsx`, `UI/TextField.tsx`, `UI/SelectField.tsx`, `UI/Modal.tsx`, `DeleteConfirmModal.tsx`, `RecordRow.tsx` | `src/api/observations.ts`, `src/lib/validation.ts` | `tests/unit/validation.test.ts`, `tests/components/RecordForm.test.tsx`, `tests/components/RecordList.test.tsx`, `tests/integration/rls.test.ts` |
| **Thami** (DevOps/Release) | `S8_ManageUsers.tsx`, `S9_ManageSources.tsx`, `OfflineBanner.tsx` | `src/api/users.ts`, `src/lib/hotspot.ts`, `src/hooks/useOnline.ts`, `.github/workflows/ci.yml`, `vercel.json` | `tests/unit/hotspot.test.ts`, `tests/components/ManageUsers.test.tsx`, `tests/components/ManageSources.test.tsx`, `tests/components/Offline.test.tsx` |

---

## Shared / Coordination Files

These files are touched by everyone — coordinate before editing:

| File | Rule |
|---|---|
| `src/App.tsx` | Lesedi owns the shell. Each teammate adds their `<Route>` import in a minimal PR and tags Lesedi for review. |
| `src/types/index.ts` | Lesedi owns it. If you need a new type, raise it in Slack and Lesedi adds it, or open a PR. |
| `package.json` | Anyone can add a dependency — open a PR, CI must stay green. |
| `vite.config.ts` | Thami owns it after CI/CD setup. Coordinate before changing. |
| `tailwind.config.js` | Galaletsang owns it. If you need a new Tailwind token, ask Galaletsang first. |

---

## Anti-Conflict Rules

1. **One owner per file.** See the matrix above. Never edit a file you don't own without tagging its owner.
2. **Never push to `main` directly.** All work goes through PRs with 1 approval + green CI.
3. **Branch naming:** `feature/<issue>-short-name`, `docs/<issue>-short-name`, `chore/<issue>-short-name`
4. **Commit messages:** Conventional commits with the issue number, e.g. `feat(map): add hotspot pins (#34)`.
5. **Never commit `.env` or any secret.** Use `src/lib/supabase.ts` env var pattern.
6. **Only the PR author merges their own work.**
7. **New files:** If you need a file not listed here, create it in your own namespace (e.g. `src/components/MyNewComponent.tsx`) and add it to this README in the same PR.

---

## Per-Member Guides

- [Lesedi — Tech Lead](./lesedi-tech-lead.md)
- [Lerato — Product Owner](./lerato-product-owner.md)
- [Galaletsang — Designer](./galaletsang-designer.md)
- [Gareth — QA / Test Lead](./gareth-qa-test-lead.md)
- [Thami — DevOps / Release](./thami-devops-release.md)
