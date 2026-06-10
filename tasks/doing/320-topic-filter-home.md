---
id: 320-topic-filter-home
title: Topic selection / filtering on the home page
area: feature
component:
article:
depends_on: []
order: 320
---

# Topic selection / filtering on the home page

**Goal:** let visitors filter the home article grid by topic (the first post-interactive feature
Seva asked for).

**Context:** home → `src/pages/[lang]/index.astro` (the `.card-grid`) · cards →
`src/components/ArticleCard.astro` (each has `data-topic`) · topic names → `topicNames` in
`src/i18n/ui.ts` · tech → `CONVENTIONS.md`.

## Steps

1. Add a row of topic filter chips above the grid (built from the topics actually present in the
   article set, labeled via `topicNames`, plus an "All" option).
2. Filter the grid by selected topic. Prefer **progressive enhancement**: render all cards in Astro;
   a small client script (or a tiny React island) toggles visibility via the existing `data-topic`
   attribute. With JS off, all cards show.
3. Reflect the active filter in the URL hash/query if cheap, so it's shareable (optional).
4. Add chrome strings → `ui.ts` (`home.filter.*`, e.g. "All topics", aria labels), EN+UK.

## Acceptance

- [ ] `npm run build` → 0 errors.
- [ ] Filtering works in both languages; "All" resets; keyboard-accessible chips with aria state.
- [ ] No-JS fallback shows every card. Works at 375px.

## Notes

- New topics appear automatically since chips derive from the live article set.
- Deeper per-topic landing pages are the optional follow-up `330-topic-landing-pages`.
