---
id: 170-int-vitality-map
title: Build the vitality-map interactive
area: interactive
component: vitality-map
article: language-death-and-revival
depends_on: [010-interactive-foundation]
order: 170
---

# Build the vitality-map interactive

**Goal:** a split view of language death (left) and revival (right) + a "revival recipe" gauge.

**Context:** spec → `CLAUDE.md` › `vitality-map` · article →
`content/{en,uk}/language-death-and-revival.md` · tech → `CONVENTIONS.md` · topic accent → `revival`.

## Steps

1. `src/components/interactive/VitalityMap.tsx` (prop `lang`).
2. **Left:** vitality counter (~7,000 living languages, ~40% endangered), a "falling silent" ticker,
   clickable last-speaker stories (Eyak / Marie Smith Jones).
3. **Right:** Hebrew revival curve (~0 native speakers in 1880 → ~9M today, log scale) + mini-cases
   Welsh, Māori, Hawaiian, Crimean Tatar.
4. **Revival recipe:** toggles for school / media / state status / home use animating a vitality
   gauge — **home use weighted heaviest**.
5. Counts, cases, curve points → `vitalityMap.data.ts`; chrome → `ui.ts` (`vitalityMap.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Counter + ticker animate (gated on reduced-motion); last-speaker stories localized.
- [ ] Revival recipe toggles move the gauge with home-use weighted highest.

## Notes

- All figures must come from the article; gaps → `TODO(seva)`.
