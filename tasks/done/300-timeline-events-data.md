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

## Done — 2026-06-10

Shipped `src/data/timelineEvents.ts`: a typed (`TimelineEvent`), bilingual dataset of **40 events**
spanning ~7 Mya (chimp-lineage split) → 2023 (machines join language change). Each row has EN+UK
`title`/`blurb`, a `topic`, and a source `slug` linking back to its article.

**Sourcing audit.** Verified every event's core claim against `content/en/<slug>.md`. All 40 trace
to an article — after one removal:

- **Removed** an unsourced event: *"1920 — 'Robot' is born in Prague"* (Čapek / R.U.R. / `robota`).
  Neither `content/en/machine-languages.md` nor the UK pair mentions robot/Čapek/R.U.R./Prague, so
  per the hard rule (omit or `TODO(seva)`) it was dropped rather than invented.

`TODO(seva)`: a few `year` values are **plot anchors** that position a documented event on the log
axis rather than exact dates stated in prose — the *fact* is sourced, the year just places it:
`deadline`=1864 (article: "Civil War", 1861–65); Grimm's Law "fires"=−500 (article: "first
millennium BCE"); Chomsky hierarchy=1956 (article: "the 1950s"); PIE spoken=−3500 (article:
"5,000–6,000 years ago"). Flagged in the file header comment — confirm they read acceptably.

Files: `src/data/timelineEvents.ts`. `npm run build` → 0 errors.
