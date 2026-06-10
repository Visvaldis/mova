---
id: 300-timeline-events-data
title: Build the aggregated timeline event dataset
area: feature
component:
article: (all)
depends_on: []
order: 300
---

# Build the aggregated timeline event dataset

**Goal:** a typed, bilingual dataset of dated milestones gathered from **all** articles, for the
master timeline page. (Data layer only — the UI is `310`.)

**Context:** spec → `CLAUDE.md` › Pages › Timeline page · all articles in `content/en|uk/` ·
range ~135,000 BCE → today, log-scaled.

## Steps

1. Read each article and extract its dated milestones (e.g. origins: chimp split ~7 Mya, FOXP2,
   ~135 kya capacity, writing ~5.2 kya; sound: Grimm 1822, Verner 1875, Great Vowel Shift 1400–1700;
   ukrainian-history: 1798, 1863, 1876, 1991, …; writing-systems, traveling-words, etc.).
2. Write `src/data/timelineEvents.ts`, typed:
   `{ year: number /* negative = BCE */, title: {en,uk}, blurb: {en,uk}, topic: string, slug: string }[]`.
   Link each event back to its article via `slug`.
3. **Every event must come from an article.** Anything you can't source → omit or `TODO(seva)`.

## Acceptance

- [ ] `npm run build` → 0 errors (module type-checks).
- [ ] Events span deep prehistory → today; each has EN+UK title/blurb, a topic, and a source slug.

## Notes

- Keep this the single source of truth so adding an article = adding rows here, then the UI updates.
