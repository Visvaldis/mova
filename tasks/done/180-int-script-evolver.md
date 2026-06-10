---
id: 180-int-script-evolver
title: Build the script-evolver interactive
area: interactive
component: script-evolver
article: writing-systems
depends_on: [010-interactive-foundation]
order: 180
---

# Build the script-evolver interactive

**Goal:** a "letter time machine" that morphs a glyph across 4,000 years, plus a script tree and a
rebus mini-game.

**Context:** spec → `CLAUDE.md` › `script-evolver` · article → `content/{en,uk}/writing-systems.md` ·
tech → `CONVENTIONS.md` · topic accent → `writing`.

## Steps

1. `src/components/interactive/ScriptEvolver.tsx` (prop `lang`).
2. Pick a letter (A, B, M…) and scrub its morph: Egyptian pictograph → Proto-Sinaitic → Phoenician →
   Greek → Latin, with the **Cyrillic branch drawn in parallel** (highlight Ukrainian А, Б, М).
3. Secondary view: script family tree (the ~4 independent inventions as roots).
4. Mini-game: "rebus machine" — combine pictures to spell a sound-word (teaches the rebus principle).
5. Glyph stages (SVG paths) + tree data → `scriptEvolver.data.ts`; chrome → `ui.ts` (`scriptEvolver.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Scrub morphs the glyph; Cyrillic branch + Ukrainian letters highlighted.
- [ ] Script tree renders; rebus mini-game gives feedback; usable at 375px.

## Notes

- Letter shapes/stages: line-drawing SVGs. Anything beyond the article → `TODO(seva)`.
