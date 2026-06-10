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

## Done — 2026-06-10

Built the `script-evolver` island — three tabs, all article-sourced.

**Shipped**
1. **Letter time machine** — pick A / B / M, scrub a 5-stage morph (Egyptian
   pictograph → Proto-Sinaitic → Phoenician → Greek → Latin) on a native range
   slider, with step buttons and a gated autoplay. The modern stage forks into
   Latin **and** Cyrillic side by side, the Ukrainian glyph ringed + badged
   ("Ukrainian is here"). A pictograph card shows the article's ox/house/water +
   Semitic name + sound + the "A is a flipped ox head" line. A horizontal lineage
   strip (line-drawing thumbnails) doubles as jump-to-stage nav and shows the
   Latin/Cyrillic fork. Glyphs are hand-authored line-drawing SVGs.
2. **Where writing began** — the ~4 from-scratch inventions (Mesopotamia ~3300,
   Egypt ~3200, China ~1200, Mesoamerica ~600 BCE) as a tappable tree; the
   alphabet branch (Proto-Sinaitic → Phoenician → Greek → Latin & Cyrillic)
   nests under Egypt; Hangul (1443) kept in a separate "deliberately designed —
   not one of the four" section so it isn't miscounted. Tap → detail card.
3. **Rebus machine** — the article's Sumerian arrow (ti = "life") as the shared
   opener, then language-specific playable puzzles (EN: bee+leaf=belief,
   eye+sea=icy · UK: 7+Я=сім'я, чай+К=чайка). Tap picture tiles to build the
   sound; live "your sounds" readout; solved/try-again feedback; clear + next.

**Files**
- `src/components/interactive/ScriptEvolver.tsx` (new)
- `src/components/interactive/ScriptEvolver.module.css` (new)
- `src/components/interactive/scriptEvolver.data.ts` (new — glyphs, stages, tree, rebus)
- `src/i18n/ui.ts` (+ `scriptEvolver.*` chrome, en + uk)
- `src/components/Interactive.astro` (registered the id)

**Verification**
- `npm run build` → 0 errors (60 pages).
- Island mounts on `/en` and `/uk`; placeholder no longer shows for the id.
- Both langs render; rebus/tree tab content hydrate on switch (only the default
  tab is in static HTML, by design). Topic `writing` accent inherited; light/dark
  via CSS vars. Autoplay gated on `useReducedMotion`; play button hidden when
  reduced. Slider/tabs/tiles/thumbs are native buttons → keyboard-accessible with
  bilingual aria. Fork view collapses cleanly at 375px; `when` column hides <460px.

**TODO(seva)**
- Intermediate glyph forms (Proto-Sinaitic / Phoenician / Greek letterforms) are
  illustrative line-drawings of the known historical shapes — paleographic common
  knowledge, not stated in *this* article. The article directly attests the
  ox/house/water origins and the A = flipped-ox-head claim (Latin + Cyrillic); the
  drawn morph is the vehicle for that fact. A surfaced caption flags this in the UI.
