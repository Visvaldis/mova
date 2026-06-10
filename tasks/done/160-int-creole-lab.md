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

## Done — 2026-06-10

Built the `creole-lab` interactive: two tabs, both article-sourced.

**Tab 1 — Generations.** The same message (illustrative scene: *a girl rolls a ball
down to a boy*) shown at three stages with a stage selector + Earlier/Next stepper:
- **Home signs** (isolated children) — scattered, holistic private gestures; the whole
  event is one lump; who-did-what ambiguous.
- **Pidgin** (first cohort) — pooled into a shared, telegraphic word string; vocab shared
  but order loose and "roll-down" still one lump; still ambiguous.
- **Creole / NSL** (second cohort) — fixed word order, the holistic gesture split into
  discrete recombinable parts (**roll + down**), and a spatial-grammar arc (girl→boy) so
  "who did what to whom" is built into the form. Role tags appear only here.

Each step highlights newly-added units (accent ring + "new" badge) and lists *what this
cohort added* — all from the article (shared vocabulary; consistent word order; verb
agreement / spatial grammar; holistic→discrete decomposition). An ambiguity pill flips
from "Ambiguous" to "Built into the grammar". Closes with the article's Bickerton
"bioprogram" vs. parent-language-continuity debate.

**Tab 2 — World map.** Schematic equirectangular world (rough continent silhouettes +
graticule) with markers for the four contact languages the article names: NSL, Haitian
Creole, Tok Pisin, Jamaican Patois. Markers are clickable; a keyboard-accessible pill row
doubles as legend + selector. Selecting shows a card: where, how it was born, and parent
languages.

**Files:** `src/components/interactive/CreoleLab.tsx`, `CreoleLab.module.css`,
`creoleLab.data.ts`; `creoleLab.*` chrome added to `src/i18n/ui.ts` (en + uk); registered
in `src/components/Interactive.astro`. Topic accent `birth` and
`interactiveInfo['creole-lab']` were already wired.

**Verification:** `npm run build` → 0 errors (58 pages). Placeholder no longer renders for
`creole-lab`; island hydrates (`CreoleLab.*.js`). `npm run preview` smoke:
`/en|uk/new-languages/` return 200 and render the gen tab (scene, stages, ambiguity,
bioprogram) in both languages. No hardcoded user-facing strings; topic CSS variables only
(no hex); motion is CSS-only (globally neutralized under `prefers-reduced-motion`); native
buttons throughout with bilingual aria.

**TODO(seva):** the article names the four contact languages but **not** the specific
parent languages of the three spoken creoles (it only says creolists trace "continuity
from the parent languages"). The map's *parent languages* field shows that article-true
generic line; to name specific source languages (e.g. French/West-African for Haitian
Creole, English-lexified for Tok Pisin & Jamaican Patois) add them to an article first,
then surface them in `creoleLab.data.ts` (`CONTACT[].parents`). The Gen-tab scene
(girl/ball/boy) is an illustrative vehicle — labeled as such in-UI — for the article's
stated grammatical features.
