---
globs: src/pages/app/**/*.tsx
alwaysApply: false
description: High-fidelity Figma implementation rules for wallet product pages
---

# Figma Fidelity Rules

When implementing or adjusting a product screen from Figma:

## Required Inputs

- Use the exact Figma URL with `node-id=`.
- Clarify which state is being implemented: default, active, hidden, error, empty, or success.
- Clarify the intended route and interaction behavior.

## Required Review Order

1. Verify the frame size and major layout blocks.
2. Verify material layers:
   - local background/carrier under content
   - gradients
   - overlay masks
   - blur/glass effects
   - strokes and subtle borders
   - shadows or glow
3. Verify iconography and image assets from Figma.
4. Verify typography, line-height, weight, and spacing.
5. Verify stateful visuals and tap behavior.

## Implementation Rules

- Export and use real Figma assets when vector/texture fidelity matters.
- If a section has a visual carrier/background in Figma, recreate it explicitly in code.
- Do not flatten layered visuals into a single plain background unless the design clearly does so.
- Avoid replacing distinctive Figma icons with approximate hand-drawn SVGs when the exact asset is available.
- Keep page-specific visual layers in the page if abstracting them would lose fidelity.

## Acceptance

- “Looks structurally correct” is not enough.
- A screen is only done when both information hierarchy and visual material quality match at 375px width.
