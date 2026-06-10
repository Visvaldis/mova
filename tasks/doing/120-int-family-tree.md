---
id: 120-int-family-tree
title: Build the family-tree interactive
area: interactive
component: family-tree
article: language-families
depends_on: [010-interactive-foundation]
order: 120
---

# Build the family-tree interactive

**Goal:** a zoomable/collapsible Indo-European tree with a tree ⇄ map toggle.

**Context:** spec → `CLAUDE.md` › `family-tree` · article → `content/{en,uk}/language-families.md` ·
tech → `CONVENTIONS.md` · topic accent → `families`. This is a **larger** component — split into
sub-tasks if it gets unwieldy (tree view / cognate cards / map view).

## Steps

1. `src/components/interactive/FamilyTree.tsx` (prop `lang`). Root PIE → ~10 branches → modern
   languages (hand-built SVG or D3 hierarchy — no heavy charting lib).
2. Highlight **English and Ukrainian** ("you are here" for both site languages). Extinct languages
   dashed/grey.
3. Hover → speaker counts + first attestation; click a leaf → words for "mother"/"three"/"night"
   to surface cognates.
4. Toggle: tree ⇄ map (simple SVG Eurasia with branch regions colored).
5. Tree + cognate + speaker data → `familyTree.data.ts`; chrome → `ui.ts` (`familyTree.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] EN + UK nodes visibly highlighted; extinct languages distinct.
- [ ] Cognate words appear on click; tree/map toggle works; usable at 375px.

## Notes

- Speaker counts / attestation dates not in the article → `TODO(seva)`.
