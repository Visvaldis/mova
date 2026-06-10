---
id: 510-word-atlas
title: Build the Word Atlas playground toy (world word map)
area: playground
component: word-atlas
article: traveling-words
depends_on: [400-playground]
order: 510
---

# Build the Word Atlas playground toy

**Goal:** pick a word → world map of how it sounds in ~30 languages, dots colored by
etymological origin group (same color = same source). Tea/chai for everything.

**Spec → `docs/WORD-ATLAS.md`** (UX, data model, color rules, milestones).
Conventions → `tasks/CONVENTIONS.md` + `docs/PLAYGROUND.md` §4 (shared architecture).

## Steps

1. `src/lib/geo.ts` — equirectangular `project(lat, lon)` + simplified world silhouette path.
2. `src/data/playground/word-atlas.json` — languages registry (~32, reuse Babel set + lat/lon),
   then **hero-8 words first** (tea, coffee, pineapple, tomato, chocolate, mother, robot, sugar);
   every form verified (Wiktionary translations × etymonline/ЕСУМ/WOLD), debated → `unclear` group.
3. `src/components/playground/WordAtlas.tsx` — picker pills, map dots + labels, origin-group
   legend (tap to dim others), detail card, origin-point pulse (reduced-motion gated).
4. Registry entry (🌐), `pg.atlas.*` strings EN+UK, related articles links.
5. M2: remaining 16 words + label nudges. M3 (optional): speechSynthesis 🔊, arrow-key dot walk.

## Acceptance

- [ ] Hero-8 words render with correct grouping; legend dims; detail card shows native script.
- [ ] Every form sourced; no invented data; `unclear` rendered hollow-grey.
- [ ] EN+UK complete; 375px horizontal-pan map; keyboard accessible; build green.
- [ ] Island ≤ 25 KB gz code (+ data chunk); Lighthouse unaffected.

## Notes

- Dots, not territory shading — deliberate honesty about what a "language location" is.
- Don't auto-derive groups from string similarity; groups are editorial, in the data.
