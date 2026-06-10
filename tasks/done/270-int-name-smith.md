---
id: 270-int-name-smith
title: Build the name-smith interactive
area: interactive
component: name-smith
article: tolkien-languages
depends_on: []
order: 270
---

# Build the name-smith interactive

**Goal:** build `name-smith` for the new `tolkien-languages` article (order 20). Spec is in
`CLAUDE.md` (### `name-smith`).

**Context:** article → `content/{en,uk}/tolkien-languages.md` · tech → `CONVENTIONS.md` · topic
accent → `conlangs`. `interactiveInfo` entry already in `ui.ts`; add to BUILT set in
`Interactive.astro` when done.

## Steps

1. Name forge: element tiles from attested names ONLY (mor/dor/ia/mith/randir/el-elen — all six are
   in the article). Combos show literal gloss + canonical example; unattested combos get a playful
   "Tolkien might object" badge and NO invented gloss.
2. Quenya vs Sindarin sound-palette comparator (Finnish vs Welsh models, sample lines from article).
3. Mini derivation diagram: Primitive Elvish → sound laws → Quenya + Sindarin.
4. Chrome strings → `ui.ts` (nameSmith.*), EN+UK.

## Acceptance

- [ ] `npm run build` → 0 errors; 375px; keyboard accessible; reduced-motion honored.
- [ ] No invented Elvish — only article-attested elements and lines.

## Done — 2026-06-10

Built NameSmith.tsx + nameSmith.data.ts (3.1 KB gz): forge with 6 attested elements (canonical Mordor/Moria/Mithrandir with article glosses, unattested badge otherwise), Quenya/Sindarin palette comparator with flavor highlighter, derivation mini-tree. 14 nameSmith.* keys EN+UK. Data integrity script ALL OK; island SSR verified in both languages.
