# Contributing Guide

## Tech Stack

| Layer           | Choice                                                  |
| --------------- | ------------------------------------------------------- |
| Framework       | React 18 + TypeScript                                   |
| Build           | Vite 6                                                  |
| Styling         | **Tailwind CSS v4** (utility-first, no extra CSS files) |
| TMA SDK         | `@tma.js/sdk-react`                                     |
| Wallet          | `@tonconnect/ui-react`                                  |
| Routing         | `react-router-dom` v6                                   |
| Package manager | **pnpm**                                                |

---

## Setup

```bash
pnpm install
pnpm dev          # local dev (mock TMA env)
pnpm dev:https    # HTTPS (required for real Telegram testing)
```

---

## Code Quality Gates

Every commit is automatically validated by Husky:

| Tool           | What it checks                     |
| -------------- | ---------------------------------- |
| **ESLint**     | TS/React rules + react-hooks rules |
| **Prettier**   | Consistent formatting              |
| **TypeScript** | Full type-check (`tsc --noEmit`)   |
| **commitlint** | Conventional commit message format |

CI (`ci.yml`) runs the same checks on every PR + push to `master`.

---

## Coding Standards

### Commits — Conventional Commits

```
feat: add wallet balance page
fix: correct TON address truncation
refactor: extract NavCell component
chore: upgrade tailwindcss to v4.1
docs: update contributing guide
```

**Allowed types:** `feat` · `fix` · `refactor` · `chore` · `docs` · `test` · `perf` · `style`

---

### Component rules

1. **One component per file.** File name matches export name (`WalletPage.tsx` → `export const WalletPage`).
2. **No default exports** — named exports only.
3. **Props typed inline** or as a separate `interface XxxProps` in the same file.
4. **No BEM / no plain CSS** — use Tailwind utility classes exclusively.
5. **No `any`** — TypeScript strict mode is enabled; every value must be typed.

### Tailwind rules

- Use **Telegram theme tokens** (`text-tg-text`, `bg-tg-section-bg`, etc.) for all color values so the UI follows Telegram's dark/light theme automatically.
- Arbitrary values (`bg-[#007AFF]`) are allowed only for brand/fixed colors that don't change with theme.
- Avoid `@apply` — if you find yourself needing it, extract a React component instead.

### File structure

```
src/
  components/    # Shared, reusable UI components
  pages/
    app/         # Production screens (Figma); add routes in navigation/routes.tsx
    demo/        # Legacy Telegram template playground only at /demo/*
  navigation/    # Route definitions
  helpers/       # Pure utility functions
  init.ts        # App bootstrap (TMA SDK init)
  mockEnv.ts     # Dev-only TMA environment mock
```

### Imports

- Always use the `@/` path alias (maps to `src/`).
- Order: external packages → internal `@/` aliases → relative imports.
- Prefer **named imports** over namespace imports.

---

## Running checks manually

```bash
pnpm type-check      # TypeScript type check
pnpm lint            # ESLint
pnpm format          # Prettier (write)
pnpm format:check    # Prettier (check only)
pnpm build           # Production build
```

---

## Branch & PR workflow

1. Branch off `master`: `feat/my-feature` or `fix/issue-description`.
2. Keep PRs small and focused (one concern per PR).
3. CI must be green before merge.
4. Squash-merge preferred to keep `master` history clean.
