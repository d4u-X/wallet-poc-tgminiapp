---
alwaysApply: true
---

# Wallet TG Mini App: Project Rules

## Stack

- Use React 18 + TypeScript strict mode.
- Use Vite 6 with `@vitejs/plugin-react-swc`.
- Use Tailwind CSS v4 plus the existing central CSS entry/theme files.
- Use `@tma.js/sdk-react` for Telegram Mini App integration.
- Use `@tonconnect/ui-react` for TON wallet integration.
- Use `react-router-dom` v6 with `HashRouter`.
- Use `clsx` for conditional class names.
- Use `pnpm` for package management.

## Product vs Demo

- Product UI lives under `src/pages/app/`.
- Archived template/demo UI lives under `src/pages/demo/` and `/demo/*` only.
- Product screens must use the wallet design system from Figma, not Telegram host palette tokens.

## Code Rules

- Prefer one named export per file. Avoid default exports.
- Use `@/` path aliases instead of deep relative imports.
- Keep props typed in the same file with `type` or `interface`.
- Do not suppress errors with `@ts-ignore`.

## Styling Rules

- Product screens use wallet design tokens from `src/styles/wallet-theme.css`.
- Do not introduce CSS modules or BEM.
- Avoid `@apply`; extract React components when reuse is needed.
- Any asset under `public/` must be referenced with `publicUrl(...)`.

## Design Fidelity Rules

- Reconstruct Figma screens in layers, not just content blocks.
- Always check: background image, local carrier/background, gradients, overlays, blur, borders, shadows, masks, and icon assets.
- Do not stop at “text, icon, spacing look roughly correct”; verify material/texture layers too.
- Before abstracting a UI into reusable components, make the screen visually match first.

## Flow Rules

- Wallet onboarding is a gated flow: password -> reveal mnemonic -> backup -> verify -> home.
- Backup is mandatory in the current product design.
- Current milestone is high-fidelity UI plus mock state; do not invent real wallet logic unless requested.

## Quality Rules

- No unused imports or variables.
- Handle async errors explicitly.
- Run formatting, lint, type-check, and build after substantive edits.
