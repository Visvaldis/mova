---
id: 100-int-EXAMPLE
title: Build the <your-first> interactive
area: interactive
component: your-interactive-id
article: your-article-slug
depends_on: [000-scaffold]
order: 100
---

# Build the <your-first> interactive

**Goal:** the first real component for this project. Replace this placeholder card with a real one
(copy `_TEMPLATE.md`) once you've authored your first article + spec.

**Context:** spec → `CLAUDE.md` › `<your-interactive-id>` · article →
`content/{en,uk}/<your-article-slug>.md` · tech → `CONVENTIONS.md` · topic accent → `<topic>`.

## Steps

1. Author `content/en/<slug>.md` + `content/uk/<slug>.md` (use `docs/ARTICLE-TEMPLATE.md`).
2. Wire topic + interactive metadata (`ui.ts` `topicNames` + `interactiveInfo`; `global.css` accent).
3. Copy `src/components/interactive/_TEMPLATE.tsx` → `<PascalName>.tsx`; build per the spec.
4. Move bulky bilingual content to `<name>.data.ts`; chrome strings to `ui.ts` (namespaced).
5. Register in `Interactive.astro` (import + `BUILT` + render line).

## Acceptance

- See the standard checklist in `CONVENTIONS.md`.
