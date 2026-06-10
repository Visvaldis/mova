---
id: 260-int-esperanto-machine
title: Build the esperanto-machine interactive
area: interactive
component: esperanto-machine
article: esperanto
depends_on: []
order: 260
---

# Build the esperanto-machine interactive

**Goal:** build `esperanto-machine` for the new `esperanto` article (order 19). Spec is in
`CLAUDE.md` (### `esperanto-machine`).

**Context:** article → `content/{en,uk}/esperanto.md` · tech → `CONVENTIONS.md` · topic accent →
`conlangs`. The `interactiveInfo` entry is already in `ui.ts`; add the component to the BUILT set in
`Interactive.astro` when done.

## Steps

1. Word machine: root + affix tiles with live morpheme gloss (san+ul+ej+o → hospital). Use the
   article's san-/mal-/ul-/ej- family + standard Fundamento affixes only.
2. Challenge mode: 5 "build the word for X" targets.
3. Verb-tense dial (-as/-is/-os/-us/-u!) with gloss — zero irregularity showcase.
4. Guessability meter: hover words of an Esperanto sentence to reveal European roots.
5. All chrome strings → `ui.ts` (esperantoMachine.*), EN+UK.

## Acceptance

- [x] `npm run build` → 0 errors; works at 375px; keyboard accessible; reduced-motion honored.
- [x] Every fact/word traceable to the article or the Fundamento.

## Done — 2026-06-10

Built `esperanto-machine` as a three-tab island (`EsperantoMachine.tsx` +
`esperantoMachine.data.ts` + `EsperantoMachine.module.css`), registered in
`Interactive.astro` (import + BUILT set + conditional render) and wired all chrome
strings into `ui.ts` under `esperantoMachine.*` (EN + UK). `npm run build` → 0 errors,
106 pages; the EN/UK esperanto pages mount the real island (verified "Word machine" /
"Машина слів" in `dist`, not the placeholder).

**Tabs.**
1. **Word machine** — morpheme tiles in four groups (prefix / roots / suffixes /
   endings). Tapping tiles assembles a word with a live `·`-separated morpheme gloss;
   the article's word family lights a "From the article" badge with its idiomatic
   meaning. Undo / Clear. **Challenge mode** has 5 "build the word for X" targets.
2. **Verb dial** — pick a root, turn a 5-button tense dial (-as / -is / -os / -us /
   -u!); the conjugated form + gloss update. Showcases "no irregulars, ever".
3. **Guessability** — the article's own Esperanto terms (Doktoro, interna, ideo,
   Fundamento, Esperanto); tap to reveal the European root; a meter shows how many are
   readable on sight (4/5 — Esperanto itself is the one you must be told).

**Sourcing (acceptance "article OR Fundamento").** The san- family (sana → malsana →
malsanulo → malsanulejo), the prefix `mal-`, suffixes `-ul-`/`-ej-`, endings
`-o`/`-a`/`-j`, and tenses `-as`/`-is`/`-os` are stated in the article (`source:
'article'`). Extra roots/affixes and the `-us`/`-u!` moods are standard Fundamento
(`source: 'fundamento'`) and shown with a subtler tile fill. Only `FEATURED_WORDS`
assert an idiomatic meaning; free combinations show only the literal morpheme gloss.
The 5th challenge — `lernejo` "learn-place" = school — is the canonical textbook `-ej-`
example (exact parallel to the article's `malsanulejo`), built from the Fundamento root
`lern-` + the article's `-ej-`/`-o`, so it stays traceable. Guessability words are the
article's verbatim Esperanto terms — no invented sentence.

**A11y / mobile / motion.** Native `<button>`/`role="tab"` controls only; tiles &
words carry bilingual `aria-label`/`aria-expanded`; result blocks are `role="status"
aria-live`. All motion is pure CSS (tile/meter transitions) → neutralized by the global
reduced-motion rule; no JS animation, no `Math.random()`/`Date.now()` at render. Tiles
wrap and the dial is a responsive grid for 375px.

**TODO(seva):** none for this component — every word traces to the article or the
Fundamento as required.
