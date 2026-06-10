---
id: 900-a11y-and-lighthouse
title: Accessibility + Lighthouse pass on article pages
area: ship
component:
article:
depends_on: []
order: 900
---

# Accessibility + Lighthouse pass

**Goal:** meet the definition-of-done in `CLAUDE.md`: Lighthouse ≥ 90 performance **and**
accessibility on article pages, and every interactive keyboard/reduced-motion/aria-complete.

**Context:** definition of done → `CLAUDE.md` › Quality bar. Best run after most interactives exist.

## Steps

1. Build (`npm run build`) and serve (`npm run preview`); run Lighthouse on a few article pages
   (include one with a heavy interactive, e.g. family-tree or name-map) in EN and UK.
2. Fix performance regressions (island hydration cost, image/SVG weight, font loading).
3. Audit each interactive for: keyboard navigation, `prefers-reduced-motion`, and bilingual
   `aria`/alt text. Fix gaps (or file per-component follow-up tasks).
4. Re-measure; record scores in the Done note.

## Acceptance

- [ ] Lighthouse perf ≥ 90 and a11y ≥ 90 on sampled article pages (EN + UK).
- [ ] Every built interactive is keyboard-usable, reduced-motion aware, and has bilingual aria/alt.

## Notes

- If a specific component fails, prefer a small targeted fix task over blocking this one.
