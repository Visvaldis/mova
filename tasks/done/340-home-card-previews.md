---
id: 340-home-card-previews
title: Animated home-card previews of each interactive
area: feature
component:
article:
depends_on: []
order: 340
---

# Animated home-card previews of each interactive

**Goal:** replace the static emoji in each home card with a small animated preview of its interactive
(per `CLAUDE.md` › Pages › Home).

**Context:** card → `src/components/ArticleCard.astro` (the `.preview` div, currently the topic icon)
· CSS → `.card .preview` in `global.css` · tech → `CONVENTIONS.md`. Best done **after** the relevant
components exist — can land incrementally, one topic at a time.

## Steps

1. Decide the preview mechanism: lightweight per-topic mini-SVG/CSS animations (cheap, no hydration)
   rather than mounting full islands on the home grid (keeps Lighthouse green).
2. Implement a `preview` keyed by interactive id, falling back to the current emoji when absent.
3. Gate animation on `prefers-reduced-motion` (CSS handles most; verify).

## Acceptance

- [ ] `npm run build` → 0 errors.
- [ ] Cards show a relevant animated preview (or graceful emoji fallback); reduced-motion respected.
- [ ] Home page performance stays high (no heavy JS on the grid).

## Notes

- This can be split per topic (`340a`, `340b`, …) if you'd rather ship previews incrementally.
