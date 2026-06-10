---
id: 200-int-word-xray
title: Build the word-xray interactive
area: interactive
component: word-xray
article: everyday-etymologies
depends_on: [010-interactive-foundation]
order: 200
---

# Build the word-xray interactive

**Goal:** an "X-ray machine" that peels everyday words into morphemes with literal-image art.

**Context:** spec → `CLAUDE.md` › `word-xray` · article → `content/{en,uk}/everyday-etymologies.md` ·
tech → `CONVENTIONS.md` · topic accent → `everyday`.

## Steps

1. `src/components/interactive/WordXray.tsx` (prop `lang`).
2. Row of word cards (muscle, disaster, companion, sarcasm, candidate, deadline, вікно, ведмідь).
   Click → the word peels into morphemes with the literal image (little mouse, bad star, with-bread…)
   as minimal line-drawing SVG + a 1-sentence story.
3. Mode 2: "literal sentence" — a sample sentence re-renders with literal meanings swapped in.
4. Mode 3: doublet-matcher — connect pairs (royal/regal, skirt/shirt, город/град).
5. Word breakdowns + doublets → `wordXray.data.ts`; chrome → `ui.ts` (`wordXray.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Cards peel into morphemes with art + story; all three modes work.
- [ ] Doublet-matcher gives feedback; usable at 375px (tap, not just drag).

## Notes

- Etymologies must come from the article; gaps → `TODO(seva)`.
