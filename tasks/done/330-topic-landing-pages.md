---
id: 330-topic-landing-pages
title: (Optional) Per-topic landing pages
area: feature
component:
article:
depends_on: [320-topic-filter-home]
order: 330
---

# (Optional) Per-topic landing pages

**Goal:** dedicated `/{lang}/topic/{topic}/` pages listing the articles in a topic. Deeper than the
home filter — only if Seva wants it. **Icebox / optional.**

**Context:** routing pattern like `src/pages/[lang]/[slug].astro` · topics → `topicNames` ·
tech → `CONVENTIONS.md`.

## Steps

1. `src/pages/[lang]/topic/[topic].astro` with `getStaticPaths` over `(lang × topics present)`.
2. Each page: topic name + intro + the article cards for that topic (reuse `ArticleCard`).
3. Link the topic chips (cards + home filter) to these pages.
4. Chrome → `ui.ts` (`topic.*`), EN+UK.

## Acceptance

- [ ] `npm run build` → 0 errors; pages generated for every present topic × language.
- [ ] Chips link correctly; works at 375px.

## Notes

- Confirm with Seva before building — the home filter (`320`) may be enough.
