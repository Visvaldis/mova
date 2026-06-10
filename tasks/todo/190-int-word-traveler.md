---
id: 190-int-word-traveler
title: Build the word-traveler interactive
area: interactive
component: word-traveler
article: traveling-words
depends_on: [010-interactive-foundation]
order: 190
---

# Build the word-traveler interactive

**Goal:** an animated journey map tracing a borrowed word's route, plus a quiz.

**Context:** spec → `CLAUDE.md` › `word-traveler` · article → `content/{en,uk}/traveling-words.md` ·
tech → `CONVENTIONS.md` · topic accent → `borrowing`.

## Steps

1. `src/components/interactive/WordTraveler.tsx` (prop `lang`).
2. Pick a word (tea/чай, sugar/цукор, orange, кава, майдан, козак; borshch/steppe as exports) and
   animate its route across a world map, with a stop-card at each language showing the changing form.
3. The **tea** map doubles as a sea-vs-land coloring (te-by-sea vs cha-by-land).
4. Quiz mode: "guess where this word started" with 5 words.
5. Routes + forms + quiz → `wordTraveler.data.ts`; chrome → `ui.ts` (`wordTraveler.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Route animates (gated on reduced-motion) with localized stop-cards.
- [ ] Tea sea/land coloring works; quiz scores; usable at 375px.

## Notes

- Routes/forms must come from the article; gaps → `TODO(seva)`.
