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

## Done — 2026-06-10

Built `word-traveler` as a two-tab island.

**Files**
- `src/components/interactive/wordTraveler.data.ts` — 8 words (tea, orange, sugar,
  кава, майдан, козак, степ→steppe, борщ→borshch) as `route`/`radial` journeys with
  per-stop `{lat, lon, place, form, note}`; 5-question origin quiz. All forms/routes
  cited to `traveling-words.md` in the header comment.
- `src/components/interactive/WordTraveler.tsx` + `.module.css`.
- `ui.ts` — `wordTraveler.*` chrome (en + uk).
- Registered in `Interactive.astro` (`BUILT` + conditional render).

**Journey tab** — word picker → animated route across the shared `geo.ts` world map
(real Natural-Earth coastline). Origin + revealed stops draw as arcs; a keyboard-
accessible "form trail" of chips doubles as the per-stop jump control; a live
stop-card shows the changing form + note. Autoplay/step/scrub; **autoplay gated on
`useReducedMotion`** (reduced → full route shown, no play button). Forks (sugar →
English vs Ukrainian) render as two branches; **tea uses radial sea-vs-land layout**
— solid+filled = "te by sea", dashed+hollow = "cha by land" (distinguished without a
second hue so it survives the borrowing theme where `--accent` == `--accent-2`, and
stays colour-blind-safe).

**Quiz tab** — "where did this word begin?", 5 words (tea→China, orange→India,
кава→Arabia, козак→Turkic, майдан→Persia), per-answer explanation + running score +
result screen.

**Facts/TODOs** — `майдан` and `козак` intermediate forms aren't in the article, so
those stops show the place + note (and `wordTraveler.formUnknown`) instead of an
invented form; flagged inline. No other gaps — orange/sugar/tea/кава carry full form
chains from the article.

**Verified** — `npm run build` clean (60 pages, 0 errors); island hydrates on both
`/en/` and `/uk/traveling-words/`, journey tab server-renders (picker, gloss, map,
trail, badges), placeholder gone. `src/lib/geo.ts` untouched.

**TODO(seva):** Persian/Turkic intermediate forms for майдан, and the Turkic form for
козак, are not given in `traveling-words.md` — add them if a source is available.
