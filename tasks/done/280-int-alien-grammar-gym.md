---
id: 280-int-alien-grammar-gym
title: Build the alien-grammar-gym interactive
area: interactive
component: alien-grammar-gym
article: hollywood-conlangs
depends_on: []
order: 280
---

# Build the alien-grammar-gym interactive

**Goal:** build `alien-grammar-gym` for the new `hollywood-conlangs` article (order 21). Spec is in
`CLAUDE.md` (### `alien-grammar-gym`).

**Context:** article → `content/{en,uk}/hollywood-conlangs.md` · tech → `CONVENTIONS.md` · topic
accent → `conlangs`. `interactiveInfo` entry already in `ui.ts`; add to BUILT set in
`Interactive.astro` when done.

## Steps

1. OVS scrambler: arrange sentence tiles into object–verb–subject; word-order frequency strip
   (SOV/SVO common → OVS rarest). TODO(seva): exact %-figures aren't in the article — either keep
   the strip qualitative (common → rare) or source figures (WALS) and cite in a tooltip.
2. Alien-o-meter: pick 3 phonemes; rare co-occurrences (retroflex D + uvular q + tlh, from the
   article) score "properly alien", common combos "too human".
3. Designer match: Okrand→Klingon, Frommer→Na'vi, Peterson→Dothraki/Valyrian with method one-liners
   from the article.
4. Chrome strings → `ui.ts` (alienGym.*), EN+UK.

## Acceptance

- [ ] `npm run build` → 0 errors; 375px; keyboard accessible; reduced-motion honored.
- [ ] Facts traceable to the article (or marked TODO(seva)).

## Done — 2026-06-10

Built AlienGrammarGym.tsx + alienGym.data.ts (3.3 KB gz): OVS scrambler with WALS-81A-cited frequency strip (per-card note: figures sourced to WALS, cited in UI caption, since the article is qualitative), 9-phoneme alien-o-meter maxed by the Okrand ensemble, designer match with article method notes. 27 alienGym.* keys EN+UK. Data integrity ALL OK; SSR verified both languages.
