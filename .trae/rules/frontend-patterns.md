---
globs: src/**/*.tsx
alwaysApply: false
description: React and Tailwind implementation patterns for this wallet project
---

# Frontend Patterns

## Components

- Prefer concise function components with named exports.
- Use `clsx` for conditional classes.
- Keep component props local to the file.
- Avoid over-abstracting product screens too early.

## Styling

- Prefer wallet semantic tokens like `bg-wallet-surface-muted`, `text-wallet-text`, `border-wallet-border`.
- Use ad-hoc gradients or one-off rgba values only when they directly match Figma.
- If a card/section has a special material treatment, implement it in the page instead of flattening it into a generic component.

## Hooks

- Use hooks only at the top level.
- Use `useMemo` for meaningful derived structures.
- Use `useCallback` when handler identity matters.

## Assets

- Product assets under `public/` must be loaded via `publicUrl(...)`.
- Prefer exact Figma-exported assets over approximate handwritten SVG replacements when fidelity matters.

## QA

- Check the result at 375px width first.
- Verify both layout hierarchy and visual texture/material before considering a screen done.
