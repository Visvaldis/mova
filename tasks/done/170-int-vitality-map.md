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

## Done — 2026-06-10

Built the `vitality-map` interactive — a split death/revival view plus a revival-recipe gauge.

**Files**
- `src/components/interactive/VitalityMap.tsx` — the island (`lang` prop).
- `src/components/interactive/VitalityMap.module.css` — scoped styles, all topic CSS vars (no hex).
- `src/components/interactive/vitalityMap.data.ts` — figures, last-speaker story, shift steps, Hebrew anchors, mini-cases, recipe ingredients + weights, gauge bands.
- `src/i18n/ui.ts` — `vitalityMap.*` chrome strings (en + uk).
- `src/components/Interactive.astro` — registered `vitality-map`; placeholder no longer shows.

**What shipped**
- **Left (death):** animated count-up to ~7,000 living languages + a ~40% endangered bar; a "falling silent" candle ticker (gated, explicitly labeled illustrative pace); a clickable Eyak / Marie Smith Jones last-speaker story; the three-generation "death by shift" with fluency meters.
- **Right (revival):** the Hebrew curve (≈0 native speakers 1880 → ~9M today, log scale, progressive draw + replay) with the Ben-Yehuda story; five clickable mini-cases (Welsh, Māori, Hawaiian, Crimean Tatar, Cornish & Manx).
- **Revival recipe:** five article-named ingredient toggles driving a semicircular vitality gauge (needle + arc fill). **Home use is weighted heaviest** (0.40 vs ≤0.20 for the rest); status note adapts to whether home use is on. Labeled an illustrative model.

**Decisions**
- Used the article's *five* ingredients (prestige + the task's four: school / media / state / home) rather than four — the article explicitly enumerates prestige first, so this is more faithful; home is still weighted heaviest as required.
- Hebrew curve plots only the two article anchor points; the line between them is schematic (constant exponential growth on the log axis), called out in `hebrewNote`.

**Verification:** `npm run build` → 0 errors (58 pages). `tsc --noEmit` clean for all new files / `ui.ts` (one *pre-existing* error in `aiLanguageLab.data.ts` is unrelated and not run by the build). Component mounts + every string renders in both `en` and `uk` (verified in built HTML). Motion (count-up, ticker, chart draw) gated on `useReducedMotion`; gauge/needle use CSS transitions auto-neutralized under reduced motion.

**TODO(seva)**
- The article documents only one last-speaker story in detail (Eyak). More named last-speaker stories would each need to be added to an article first, then surfaced via `LAST_SPEAKERS` in `vitalityMap.data.ts`.
