---
id: 160-int-creole-lab
title: Build the creole-lab interactive
area: interactive
component: creole-lab
article: new-languages
depends_on: [010-interactive-foundation]
order: 160
---

# Build the creole-lab interactive

**Goal:** a generation simulator showing a language regularize from home signs → pidgin → creole.

**Context:** spec → `CLAUDE.md` › `creole-lab` · article → `content/{en,uk}/new-languages.md` ·
tech → `CONVENTIONS.md` · topic accent → `birth`.

## Steps

1. `src/components/interactive/CreoleLab.tsx` (prop `lang`).
2. Three panels of the **same message**: scattered home signs → pidgin (telegraphic word string) →
   grammaticalized creole/NSL (markers, fixed word order). User steps through generations; highlight
   what each cohort adds.
3. Second tab: world map of major contact languages (Haitian Creole, Tok Pisin, Jamaican Patois,
   NSL) with parent languages on hover.
4. Message stages + map data → `creoleLab.data.ts`; chrome → `ui.ts` (`creoleLab.*`).
5. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] Stepping through generations visibly regularizes the message; per-cohort additions highlighted.
- [ ] Map tab shows contact languages + parents; usable at 375px.

## Notes

- Examples (NSL etc.) must come from the article; gaps → `TODO(seva)`.
