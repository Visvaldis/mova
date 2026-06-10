---
id: 910-self-host-fonts
title: Self-host fonts (drop the Google Fonts CDN)
area: ship
component:
article:
depends_on: []
order: 910
---

# Self-host fonts

**Goal:** replace the Google Fonts CDN with self-hosted fonts for performance, privacy, and offline
builds — keeping good Cyrillic coverage.

**Context:** current link → `src/layouts/BaseLayout.astro` (`<link>` to `fonts.googleapis.com`,
Inter with cyrillic+latin subsets) · font stack → `--font-sans` in `src/styles/global.css`
(`Inter`, `Fixel`, `e-Ukraine`).

## Steps

1. Add self-hosted woff2 files (Inter, and optionally Fixel / e-Ukraine for stronger Cyrillic) under
   `public/fonts/` (or via an Astro fonts integration).
2. Add `@font-face` rules (latin + cyrillic subsets, `font-display: swap`); preload the main weight.
3. Remove the Google Fonts `<link>` and `preconnect`s from `BaseLayout.astro`.
4. Verify Cyrillic renders correctly across the site (especially the Ukrainian pages).

## Acceptance

- [ ] `npm run build` → 0 errors; no external font requests at runtime.
- [ ] Latin + Cyrillic render correctly in light/dark, EN + UK.
- [ ] No layout shift regression (check the home hero and article headings).

## Notes

- Licensing: Inter (OFL) and Fixel/e-Ukraine — confirm license before committing the files.
