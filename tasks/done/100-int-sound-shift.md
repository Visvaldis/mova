---
id: 100-int-sound-shift
title: Build the sound-shift interactive (Grimm's Law explorer)
area: interactive
component: sound-shift
article: sound-change
depends_on: [010-interactive-foundation]
order: 100
---

# Build the sound-shift interactive (Grimm's Law explorer)

**Goal:** the first real component — port the existing prototype to a React island. Proves the whole
registry → island → i18n pattern end-to-end. **Do this one first.**

**Context:** spec → `CLAUDE.md` › `sound-shift` · article → `content/{en,uk}/sound-change.md` ·
**prototype → `prototype-sound-shift.html`** (working, with all data + EN/UK strings + 3 panels) ·
tech → `CONVENTIONS.md` · topic accent → `sound` (violet).

The prototype already implements: (1) a stage slider PIE/Latin → shift fires → Modern English across
six words, (2) a "try a rule" mode highlighting every word a rule applies to, (3) an SVG chain-shift
diagram. All facts (pater→father, trēs→three, cornu→horn, два/two…) match the article.

## Steps

1. Create `src/components/interactive/SoundShift.tsx` (prop `lang`). Port the three panels.
2. Move the `WORDS` / `RULES` data and word glosses → `src/components/interactive/soundShift.data.ts`
   (typed). Move chrome strings (titles, hints, stage labels, diagram labels) → `ui.ts` namespaced
   `soundShift.*`, EN+UK.
3. Replace the prototype's hardcoded violet with topic CSS variables; **delete its internal
   lang-toggle** — use the `lang` prop.
4. Gate the `pop` animation on `useReducedMotion()` (from task 010); static end-state when reduced.
5. Register `'sound-shift': SoundShift` in `src/components/Interactive.astro`.

## Acceptance

- See the standard checklist in `CONVENTIONS.md`, plus:
- [ ] Slider steps through all three stages; affected consonants animate, others stay put.
- [ ] "Try a rule" dims non-matching words and fires the rule across all matches.
- [ ] Chain-shift SVG renders and is readable at 375px.

## Notes

- This task also validates task 010's hook + shared styles in a real component.
