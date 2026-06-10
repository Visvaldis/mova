---
id: 530-word-index
title: Build the word index (/words/)
area: feature
component: word-index
article: (site-wide)
depends_on: [400-playground]
order: 530
---

# Build the word index (/words/)

**Goal:** `/{lang}/words/` — alphabetical, searchable index of every word in the site's five
curated datasets (~1,000 entries), statically rendered with a tiny filter island. The site's
hidden encyclopedia, made visible.

**Spec → `docs/WORD-INDEX.md`** (sources table, merge rules, deep links, page design).

## Steps

1. `src/lib/word-index.ts` — build-time aggregator over etymologies/atlas/cognates/lexicon/babel;
   normalize keys, merge same-script+same-sense only ("two entries beat one wrong entry").
2. Deep-link params: WordAtlas reads `?word=`, WordTimeMachine reads `?w=` on mount.
3. `src/pages/[lang]/words/index.astro` — per-letter sections (А–Я + A–Z), rich entries first,
   compact lexicon rows; stats header; static HTML for crawlability.
4. `src/components/words/WordFilter.tsx` — DOM-filtering island (≤ 4 KB gz, no data duplication).
5. Links: footer + home card + 404 suggestion. i18n `words.*`.

## Acceptance

- [ ] ~all dataset words present, merged correctly (spot-check чай/три/robot multi-source entries).
- [ ] Deep links open the right word in both toys; URLs shareable.
- [ ] Filter works without JS data payload; page usable with JS off.
- [ ] EN+UK complete; page ≤ ~90 KB gz; build green.
