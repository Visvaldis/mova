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

## Done — 2026-06-10

Built the `word-xray` island — three modes behind a `role="group"` pill switcher
(matching the slang-decoder pattern), accent inherited from the `everyday` (lime)
topic vars, light/dark via CSS vars only.

**Mode 1 · X-ray words** — grid of the eight cards named in the task (muscle,
disaster, companion, sarcasm, candidate, deadline, вікно, ведмідь). Tap → a panel
where the word peels into its morphemes (staggered `wxPeel` CSS animation, so it's
auto-neutralized under `prefers-reduced-motion`), beside a minimal line-drawing SVG
of the buried picture (mouse / star / bread / dog / toga / boundary-line / eye /
honeycomb), the literal meaning, and a one-sentence story.

**Mode 2 · Literal sentence** — the article's own example sentence ("the candidate's
salary was a disaster" / «платня кандидата виявилася катастрофою»). Tappable
underlined words swap to their literal gloss; Reveal-all / Reset. (UK «платня» is
left un-tappable on purpose — it's English *salary* that hides the salt, not
Ukrainian платня — so кандидат + катастрофа are the swaps there.)

**Mode 3 · Doublet matcher** — tap one twin, then its partner; correct → locks +
reveals the shared-origin story, wrong → red shake + live message. Five pairs
(royal/regal, skirt/shirt, captive/caitiff, город/град, молоко/млеко). Tap-based
(no drag), keyboard-accessible native `<button>`s, Shuffle to replay. Initial tile
order is deterministic (SSR-stable); `Math.random` only fires in the Shuffle click.

**Files**
- `src/components/interactive/WordXray.tsx` (new)
- `src/components/interactive/WordXray.module.css` (new)
- `src/components/interactive/wordXray.data.ts` (new — words, sentence, doublets)
- `src/i18n/ui.ts` (+ `wordXray.*` chrome, en + uk)
- `src/components/Interactive.astro` (registered `word-xray`)

**Verification**
- `npm run build` → 0 errors (60 pages).
- Island server-renders on `/en` and `/uk/everyday-etymologies/` (tabs + default
  x-ray panel in static HTML); placeholder gone for the id; no EN-fallback leakage
  on the UK page. Not browser-clicked (no Playwright installed) — same bar as the
  prior interactives; client logic reviewed by hand.

**TODO(seva)** — none. Every etymology, gloss, story, doublet and the sample
sentence trace to `everyday-etymologies.md`. The morpheme segmentation of `ведмідь`
is shown as its meaning-bearing roots (мед "honey" + -їд "eater" = the article's
"honey-eater"); the exact Proto-Slavic metathesis isn't spelled out, but the
honey-eater gloss is article-stated.
