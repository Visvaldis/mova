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

- [ ] `npm run build` → 0 errors; works at 375px; keyboard accessible; reduced-motion honored.
- [ ] Every fact/word traceable to the article or the Fundamento.
