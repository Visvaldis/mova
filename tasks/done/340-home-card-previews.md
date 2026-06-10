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

## Done — 2026-06-10

Built one shared, hydration-free component — `src/components/CardPreview.astro` — that renders a small
inline-SVG scene per interactive id, animated with **pure CSS** (no island on the grid, so Lighthouse
stays green). `ArticleCard.astro` now mounts `<CardPreview interactive={…} icon={…} />` inside the
existing `.preview` box instead of the bare emoji. Shipped all 18 at once (not incrementally):

| id | scene |
|----|-------|
| origins-timeline | marker travels a deep-time line of milestone nodes |
| family-tree | branches from a root, leaves pop in turn |
| sound-shift | a consonant morphs **p → f** (Grimm crossfade) |
| ukrainian-timeline | marker descends a vertical era spine (accent-2 dot) |
| slang-decoder | two chat bubbles rise in turn |
| ai-language-lab | two trends draw — homogenize vs diversify |
| creole-lab | scattered home-signs converge into an ordered row |
| vitality-map | a revival curve, climber rising from near-zero |
| script-evolver | a glyph morphs across scripts **Δ → A** |
| word-traveler | a word travels a borrowing route between stops |
| word-xray | a word peels apart into its morphemes |
| roots-garden | stratigraphy layers deposit bottom-up |
| name-map | a pin drops onto a place, with a ripple |
| myth-buster | a verdict card flips **✓ ⇄ ✗** |
| thought-lens | a boundary sweeps across a colour continuum |
| accent-atlas | a speech waveform of varied dialect "voices" |
| conlang-workbench | two word-tiles slide together to compound |
| code-vs-speech | a design-feature scorecard with toggling lights |

**Conventions honored:**

- **No hardcoded color** — every fill/stroke is `var(--accent)` / `var(--accent-2)` /
  `var(--accent-soft)` / `var(--bg*)` or a `color-mix()` tint, so each scene auto-matches its topic in
  light **and** dark mode (verified the topic `data-topic` vars are inherited into `.preview`).
- **Reduced motion** — all motion is CSS keyframes, neutralized by the global
  `prefers-reduced-motion` rule (`global.css`); scenes settle to a sensible static frame. No JS motion.
- **No hydration** — it's an `.astro` component (zero client JS on the home grid).
- **Decorative** — `.preview` keeps `aria-hidden="true"`, so the SVGs add nothing for screen readers
  (the card's title/summary carry the meaning).
- **Fallback** — any id without a scene renders the original emoji (`.cp-emoji`); all 18 live ids have
  scenes, so the fallback is just defensive.

Verified: `npm run build` → 0 errors (100 pages); all 18 `cp-*` scenes present in `dist/en/index.html`
(18 `class="cp "` SVGs, 0 emoji fallbacks); Astro scoped the CSS via `data-astro-cid` with keyframe
names + `offset-path` intact in the extracted stylesheet.

No `TODO(seva)`: the previews are abstract motifs (not article facts), so the no-invented-data rule
doesn't bite — they evoke each interactive's mechanic without asserting any datum.
