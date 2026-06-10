---
id: 220-int-name-map
title: Build the name-map interactive
area: interactive
component: name-map
article: names-and-places
depends_on: [010-interactive-foundation]
order: 220
---

# Build the name-map interactive

**Goal:** a tabbed component about names — toponyms, month names, and surnames.

**Context:** spec → `CLAUDE.md` › `name-map` · article → `content/{en,uk}/names-and-places.md` ·
tech → `CONVENTIONS.md` · topic accent → `names`. **Larger** (3 tabs) — split if needed.

## Steps

1. `src/components/interactive/NameMap.tsx` (prop `lang`).
2. **Tab 1:** SVG map of Ukraine with tappable toponyms (Київ, Дніпро, Крим, Одеса, -слав/-город
   towns) → etymology cards; include the Україна "borderland vs homeland" debate card showing both views.
3. **Tab 2:** month-name wheel — 12 months as a ring, toggle EN (Roman gods/numbers) ⇄ UK (nature
   calendar), literal glosses on hover.
4. **Tab 3:** surname matcher — match English surnames to Ukrainian occupational twins
   (Smith↔Коваль, Baker↔?, Miller↔Мельник).
5. Toponyms + months + surnames → `nameMap.data.ts`; chrome → `ui.ts` (`nameMap.*`).
6. Register in `Interactive.astro`.

## Acceptance

- See `CONVENTIONS.md` standard checklist, plus:
- [ ] All three tabs work; Україна card presents both views fairly.
- [ ] Month wheel toggles EN/UK glosses; surname matcher gives feedback; usable at 375px.

## Notes

- Etymologies/glosses must come from the article; gaps (e.g. Baker↔?) → `TODO(seva)`.
