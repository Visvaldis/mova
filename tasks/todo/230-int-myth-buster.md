---
id: 230-int-myth-buster
title: Build the myth-buster interactive
area: interactive
component: myth-buster
article: etymology-myths
depends_on: [010-interactive-foundation]
order: 230
---

# Build the myth-buster interactive

**Goal:** a swipeable "real or myth?" etymology quiz with a final ranking.

**Context:** spec → `CLAUDE.md` › `myth-buster` · article → `content/{en,uk}/etymology-myths.md` ·
tech → `CONVENTIONS.md` · topic accent → `myths`.

## Steps

1. `src/components/interactive/MythBuster.tsx` (prop `lang`).
2. 8 etymology claims (posh acronym, sirloin knighting, козак←коза, bridegroom reshaping, female
   respelling, salt salary, golf acronym, ведмідь taboo). User swipes/buttons true/false, gets an
   explanation + running score; end screen ranks them "folk-etymology-proof".
3. Swipe needs a button fallback (375px). Visual: tabloid-vs-dictionary card flip
   (flip animation gated on reduced-motion).
4. Claims + verdicts + explanations → `mythBuster.data.ts`; chrome → `ui.ts` (`mythBuster.*`).
5. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] 8 claims play through with explanations and a final score/ranking.
- [ ] Works via buttons (not just swipe); card flip respects reduced-motion.

## Notes

- Claims/verdicts must come from the article; gaps → `TODO(seva)`.
