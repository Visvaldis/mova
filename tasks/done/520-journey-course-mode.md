---
id: 520-journey-course-mode
title: Build the Journey (guided course mode)
area: feature
component: journey
article: (site-wide)
depends_on: [010-interactive-foundation, 400-playground]
order: 520
---

# Build the Journey (guided course mode)

**Goal:** `/{lang}/journey/` — 6 chapters (18 articles + 6 toys) with 3-question checkpoints,
localStorage progress, and a generated "Folk-Etymology-Proof" certificate PNG whose name field
runs through Grimm's Law (reuse `src/lib/soundlaws.ts`).

**Spec → `docs/JOURNEY.md`** (chapter map, question format, progress schema, certificate).
Conventions → `tasks/CONVENTIONS.md`.

## Steps

1. `src/data/journey-questions.json` — 36 bilingual MCQs, 6/chapter, each with `article` slug;
   **every answer verifiable in the named article** (no invented facts; `why` line paraphrases it).
2. Visit beacon: 3-line script in the article page template appending slug to `mova:journey:v1`.
3. `src/components/journey/Journey.tsx` (`client:visible`) — chapter rings, article/toy links,
   checkpoint flow (pick 3 of 6, pass at 2/3, free retry), completion state.
4. Certificate: canvas 1200×850 PNG, name + Grimm transformation, date, download. Name stays local.
5. Nav "Journey / Мандрівка" (verify 375px), i18n `journey.*`, reduced-motion gating.

## Acceptance

- [ ] Chapters complete via visits + checkpoints; progress survives reload; versioned storage.
- [ ] All 36 questions sourced to articles; `why` shown after answering.
- [ ] Certificate renders in light+dark, downloads, includes Grimm'd name.
- [ ] EN+UK complete; island ≤ 20 KB gz + ~8 KB questions; build green.
